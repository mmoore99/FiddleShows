import type { TraktClient } from "@/trakt/TraktClient";
import type { MyShowsOptions } from "@/models/MyShowsOptions";
import { ShowMovieType, SyncGetWatchlistTypes } from "@/helpers/enums";
import { ShowContext } from "@/models/ShowContext";
import { LastActivitiesComparer } from "@/helpers/LastActivitiesComparer";
import type { LocalStorageService } from "@/services/LocalStorageService";
import { ref, toRaw } from "vue";
import { plainToInstance } from "class-transformer";
import { useShowStore } from "@/stores/ShowStore";
import { SeasonContext } from "@/models/SeasonContext";
import { EpisodeContext } from "@/models/EpidodeContext";
import { ShowSeasonProgress } from "@/models/ShowSeasonProgress";
import { ShowEpisodeProgress } from "@/models/ShowEpisodeProgress";

export class ShowsService {
    private _traktClient: TraktClient;
    private _showContexts: ShowContext[] = [];
    private _localStorageService: LocalStorageService;
    private _showStore;

    constructor(traktClient: TraktClient, localStorageService: LocalStorageService) {
        this._traktClient = traktClient;
        this._localStorageService = localStorageService;
        this._showStore = useShowStore();
    }

    async loadShowContexts() {
        let showContexts = ref<ShowContext[]>([]);
        const savedShowContexts = ref<ShowContext[]>([]);
        savedShowContexts.value = await this._localStorageService.getShowContexts();
        if (savedShowContexts.value && savedShowContexts.value.length > 0) {
            console.log("Loading show contexts from local storage");
            showContexts.value = plainToInstance<ShowContext, any>(ShowContext, savedShowContexts.value);
        }

        if (!savedShowContexts.value || await this.hasDataBeenUpdated()) {
            console.log("Loading show contexts from trakt api");
            showContexts.value = await this.getShowContextsForSelectedSources(this._showStore.myShowsOptions);
            this._localStorageService.setShowContexts(toRaw(showContexts.value)).then();
        }
        //console.log("localShowContexts after loadData: ", localShowContexts.value);

        this._showStore.showContexts = showContexts.value;
        console.log("ShowContexts:", showContexts.value);
        console.log("Finished - MyShows.vue loadData");
    }

    async loadSeasonsAndEpisodesForShow(showContext: ShowContext) {
        const getAllSeasonsResult = await this._traktClient.Seasons.getAllSeasons({
            showId: showContext.traktId!.toString(),
            extendedFull: true,
            extendedEpisodes: true,
        });
        const seasons = getAllSeasonsResult.content;
        console.log("Seasons:", seasons);

        showContext.seasonContexts = seasons!.map((season) => {
            const seasonContext = new SeasonContext(season);
            if (showContext.progress) {
                let seasonProgress = showContext.progress!.seasons.find((item) => item.number === season.number);
                if (seasonProgress) seasonContext.progress = seasonProgress;
            }
            console.log("seasonContext", seasonContext);

            showContext.isContainsSpecials = showContext.seasonContexts.length > 0 && showContext.seasonContexts[0].season!.title!.toLowerCase() === "specials";

            seasonContext.episodeContexts = season.episodes!.map((episode) => {
                const episodeContext = new EpisodeContext(episode!);
                // console.log(`S${season.number}E${episode.number}`);
                if (seasonContext.progress) {
                    let episodeProgress = seasonContext.progress!.episodes.find((item) => item.number === episode.number);
                    if (episodeProgress) episodeContext.progress = episodeProgress;
                }
                return episodeContext;
            });
            return seasonContext;
        });

        this._localStorageService.setShowContexts!(toRaw(this._showStore.showContexts!)).then();
    }

    hasDataBeenUpdated = async () => {
        const savedLastActivities = await this._localStorageService.getLastActivities();
        console.log(`savedLastActivities=`, savedLastActivities);
        const currentLastActivitiesResult = await this._traktClient.Sync.getLastActivities();
        const currentLastActivities = currentLastActivitiesResult.content;
        console.log(`currentLastActivities=`, currentLastActivities);

        const compareResult = new LastActivitiesComparer(savedLastActivities, currentLastActivities!).compare();
        console.log(`compareResult=${compareResult}`);
        const result = compareResult.length > 0;
        console.log(`isRefresh=${result}`);

        await this._localStorageService.setLastActivities(currentLastActivities!);
        return result;
    };

    async getShowContextsForSelectedSources(options: MyShowsOptions | null) {
        if (options?.showSources.isWatchedShows) await this.getWatchedShows();
        if (options?.showSources.isWatchedShows) await this.getWatchListShows();
        await this.GetShowProgresses();
        return this._showContexts;
    }

    async getWatchedShows() {
        const result = await this._traktClient.Sync.getWatched({
            type: ShowMovieType.shows,
            extendedFull: true,
            extendedNoSeasons: true,
        });
        if (!result.IsSuccess) throw `Unable to access watched shows, exception=${result.Exception}`;
        result.content!.forEach((item) => {
            this._showContexts.push(new ShowContext(item.show!));
        });
    }

    async getWatchListShows() {
        const result = await this._traktClient.Sync.getWatchList({
            type: SyncGetWatchlistTypes.shows,
            extendedFull: true,
        });
        if (!result.IsSuccess) throw `Unable to access watchlist shows, exception=${result.Exception}`;
        result.content!.forEach((item) => {
            const showContext = new ShowContext(item.show!);
            showContext.isInWatchList = true;
            this._showContexts.push(showContext);
        });
    }

    async GetShowProgresses() {
        const promises = this._showContexts
            .filter((item) => !item.isInWatchList)
            .map((showContext) => this._traktClient.Shows.getShowWatchedProgress({ id: showContext.show?.ids?.trakt! }));
        const results = await Promise.all(promises);
        console.log("ShowProgressResults:", results);
        for (let i = 0; i < results.length; i++) {
            if (!results[i].content) {
                console.log(`No progress content for: index=${i}, title=${this._showContexts[i].show?.title}`);
                continue;
            }
            if (this._showContexts[i].show?.ids?.trakt !== results[i].content?.traktId) {
                console.log("ids do not match", this._showContexts[i].show?.ids?.trakt, results[i].content?.traktId);
                debugger;
                continue;
            }
            this._showContexts[i].progress = results[i].content;
        }
        console.log("ShowContextsWithProgress:", this._showContexts);
    }

    setShowDisplayCategories() {
        this._showContexts.forEach((showContext) => {});
    }
}

import type { TraktClient } from "@/trakt/TraktClient";
import type { MyShowsOptions } from "@/models/MyShowsOptions";
import { ShowMovieType, SyncGetWatchlistTypes } from "@/helpers/enums";
import { ShowContext } from "@/models/ShowContext";

export class ShowsService {
    private _traktClient: TraktClient;
    private _showContexts: ShowContext[] = [];

    constructor(traktClient: TraktClient) {
        this._traktClient = traktClient;
    }

    async getShowContextsForSelectedSources(options: MyShowsOptions | null) {
        if (options?.showSources.isWatchedShows) await this.getWatchedShows();
        if (options?.showSources.isWatchedShows) await this.getWatchListShows();
        await this.GetShowProgresses();
        console.log("ShowContexts:", this._showContexts);
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
        console.log("Results:", results);
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
        this._showContexts.forEach((showContext) => {
            
        });
    }
}

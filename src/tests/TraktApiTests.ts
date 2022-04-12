import type { TraktClient } from "@/trakt/TraktClient";
import { ref } from "vue";
import type { CalendarMovie, CalendarShow } from "@/models/CalendarModels";
import type { HistoryItem, WatchedItem, WatchListItem } from "@/models/UserModels";
import type { TraktList, TraktListItem } from "@/models/ListModels";
import {
    ShowMovieType
} from "@/helpers/enums";

export class TraktApiTests {
    private _traktClient: TraktClient;

    constructor(traktClient: TraktClient) {
        this._traktClient = traktClient;
    }

    async execute() {
        const shows = ref<CalendarShow[] | null>([]);
        const movies = ref<CalendarMovie[] | null>([]);
        const historyItems = ref<HistoryItem[] | null>([]);
        const watchedShows = ref<WatchedItem[] | null>([]);
        const watchedMovies = ref<WatchedItem[] | null>([]);
        const watchList = ref<WatchListItem[] | null>([]);
        const customLists = ref<TraktList[] | null>([]);
        const mikesList = ref<TraktListItem[] | null>([]);

        // _traktApi.Calendar.getUserShows({ extendedFull: true, filters: filters2 }).then(
        //     // _traktApi.Calendar.getMyShows({ startDate: "2022-05-01", numberOfDays: 33, extendedFull: false }).then(
        //     // _traktApi.Calendar.getSeasonPremiers({ startDate: "2022-05-01", numberOfDays: 33, extendedFull: true }).then(
        //     // _traktApi.Calendar.getMyShows().then(
        //     (result) => {
        //         shows.value = result.content;
        //         console.log("Shows:", shows.value);
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
        //
        // _traktApi.Calendars.getAllMovies({ extendedFull: true }).then(
        //     (result) => {
        //         movies.value = result.content;
        //         console.log("Movies:", movies.value);
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
        //
        // _traktApi.Sync.getHistory({
        //     extendedFull: true,
        //     requestPagination: new RequestPagination({
        //         page: 1,
        //         limit: 100,
        //     }),
        // }).then(
        //     (result) => {
        //         historyItems.value = result.content;
        //         console.log("HistoryItems:", historyItems.value);
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );
        //
        this._traktClient.Sync.getWatched({type: ShowMovieType.movies, extendedFull: false, extendedNoSeasons: true
        }).then(
            (result) => {
                watchedShows.value = result.content;
                console.log("WatchedShows:", watchedShows.value);
            },
            (error) => {
                console.log(error);
            }
        );
        //
        // _traktApi.Sync.getWatched({type: ShowMovieType.movies, extendedFull: true
        // }).then(
        //     (result) => {
        //         watchedMovies.value = result.content;
        //         console.log("WatchedMovies:", watchedMovies.value);
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );

        // _traktApi.Sync.getWatchList({extendedFull: true
        // }).then(
        //     (result) => {
        //         watchList.value = result.content;
        //         console.log("WatchList:", watchList.value);
        //
        //         for (let i = 0; i < watchList!.value!.length; i++) {
        //             let entity: Show|Movie|null = null;
        //             if (watchList.value![i].movie){
        //                 entity = watchList!.value![i].movie!
        //                 console.log(`Skipping movie: ${entity.title}`);
        //                 continue;
        //             }
        //             entity = watchList!.value![i].show!
        //             const entityId = entity.ids!.trakt!;
        //             let showProgress = null;
        //             console.log(`Processing show: ${entity.title}`);
        //             _traktApi.Shows.getShowWatchedProgress({ id: entityId }).then(
        //                 (result) => {
        //                     showProgress = result.content;
        //                     console.log("ShowProgress:", showProgress);
        //                 },
        //                 (error) => {
        //                     console.log(error);
        //                 }
        //             );
        //         }
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );

        // this._traktClient.Users.getCustomLists("me").then(
        //     (result) => {
        //         customLists.value = result.content;
        //         console.log("CustomLists:", customLists.value);
        //         const listTraktId: number = customLists.value![0].ids!.trakt!;
        //         const listSlug = customLists.value![0].ids!.slug;
        //         const mikesList = ref<TraktListItem[] | null>([]);
        //         this._traktClient.Users.getCustomListItems({
        //             id: "me",
        //             listId: listTraktId,
        //         }).then(
        //             (result) => {
        //                 mikesList.value = result.content;
        //                 console.log("MikesList:", mikesList.value);
        //             },
        //             (error) => {
        //                 console.log(error);
        //             }
        //         );
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );

        // const result = await this._traktClient.Users.getCustomLists("me");
        // customLists.value = result.content;
        // console.log("CustomLists:", customLists.value);
        // const listTraktId: number = customLists.value![0].ids!.trakt!;
        // const listSlug = customLists.value![0].ids!.slug;
        // const getListItemsResult = await this._traktClient.Users.getCustomListItems({
        //     id: "me",
        //     listId: listTraktId,
        // });
        // mikesList.value = getListItemsResult.content;
        // console.log("MikesList:", mikesList.value);

        // const getAllSeasonsResult = await this._traktClient.Seasons.getAllSeasons({showId: "137178", extendedFull: true, extendedEpisodes:true});
        // const seasons = getAllSeasonsResult.content;
        // console.log("Seasons:", seasons);
        //
        // const getSeasonEpisodesResult = await this._traktClient.Seasons.getSeasonEpisodes({showId: "137178", seasonNumber:1, extendedFull: true});
        // const episodes = getSeasonEpisodesResult.content;
        // console.log("Episodes:", episodes);
    }
}

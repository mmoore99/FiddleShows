import type {
    TraktClient
} from "@/trakt/TraktClient";
import type {
    MyShowsOptions
} from "@/models/MyShowsOptions";
import {
    ShowMovieType,
    SyncGetWatchlistTypes
} from "@/helpers/enums";
import {
    ShowContext
} from "@/models/ShowContext";

export class ShowsService {
    private _traktClient: TraktClient;
    private _showContexts:ShowContext[] = [];

    constructor(traktClient: TraktClient) {
        this._traktClient = traktClient;
    }

    async getShowContextsForSelectedSources(options: MyShowsOptions | null) {
        if (options?.showSources.isWatchedShows) await this.getWatchedShows()
        if (options?.showSources.isWatchedShows) await this.getWatchListShows()
        await this.GetShowsProgress(this._showContexts);
        console.log("ShowContexts:", this._showContexts)
        return this._showContexts;
    }
    
    async getWatchedShows() {
        const result = await this._traktClient.Sync.getWatched({
            type: ShowMovieType.shows,
            extendedFull: true,
            extendedNoSeasons: true
        })
        if (!result.IsSuccess) throw `Unable to access watched shows, exception=${result.Exception}`
        result.content!.forEach((item) => {
            this._showContexts.push(new ShowContext(item.show!))
        });
    }

    async getWatchListShows() {
        const result = await this._traktClient.Sync.getWatchList({
            type: SyncGetWatchlistTypes.shows,
            extendedFull: true,
        })
        if (!result.IsSuccess) throw `Unable to access watchlist shows, exception=${result.Exception}`
        result.content!.forEach((item) => {
            this._showContexts.push(new ShowContext(item.show!))
        });
    }
    
    async GetShowsProgress(shows: ShowContext[]){
        for (const showContext of shows) {
            const result = await this._traktClient.Shows.getShowWatchedProgress({id: showContext.show?.ids?.trakt!})
            if (result.IsSuccess) showContext.progress = result.content;
        }
    }
}

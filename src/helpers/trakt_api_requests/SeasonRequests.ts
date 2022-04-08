import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";
import {
    AuthorizationRequirement,
    GetListItemsTypes,
    ShowMovieType,
    SyncGetHistoryTypes,
    SyncGetWatchlistSortTypes,
    SyncGetWatchlistTypes
} from "@/helpers/enums";
import { JsonConvert } from "@/helpers/serializers/JsonConvert";
import type { TraktClient } from "@/trakt/TraktClient";
import type { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
import { TraktExtendedInfo } from "@/trakt/parameters/traktExtendedInfo";
import type { IDictionary } from "@/models/CommonModels";
import type { RequestPagination } from "@/models/RequestModels";
import { isString, isValidDateString } from "@/helpers/Utils";
import type { HistoryItem, WatchedItem, WatchListItem } from "@/models/UserModels";
import { WatchedItemSerializer } from "@/helpers/serializers/WatchedItemSerializer";
import { WatchListItemSerializer } from "@/helpers/serializers/WatchListItemSerializer";
import type { ShowWatchedProgress } from "@/models/ShowModels";
import { ShowWatchedProgressSerializer } from "@/helpers/serializers/ShowWatchedProgressSerializer";
import type {
    TraktList,
    TraktListItem
} from "@/models/ListModels";
import type {
    Season
} from "@/models/SeasonModels";

interface IGetAllSeasonsParams {
    showId: string
    extendedFull?: boolean;
    extendedEpisodes?: boolean;
}

interface IGetSeasonEpisodesParams {
    showId: string
    seasonNumber: number
    extendedFull?: boolean;
}

export default class SeasonRequests extends TraktApiCategory {
    constructor(traktClient: TraktClient) {
        super(traktClient);
    }

    public getAllSeasons = async ({showId, extendedFull = false, extendedEpisodes = false}:IGetAllSeasonsParams) => {
        const url = `/shows/${showId}/seasons`;
        
        const extendedInfo = new TraktExtendedInfo();
        if (extendedFull) extendedInfo.setFull();
        if (extendedEpisodes) extendedInfo.setEpisodes();

        return await this._traktClient.getList<Season>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            extendedInfo: extendedInfo.hasAnySet() ? extendedInfo : null,
            serializer: JsonConvert.toSeasons,
        });
    };

    public getSeasonEpisodes = async ({showId, seasonNumber, extendedFull = false }: IGetSeasonEpisodesParams) => {
        return await this._traktClient.getList<TraktListItem>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: `/shows/${showId}/seasons/${seasonNumber}`,
            extendedInfo: extendedFull ? new TraktExtendedInfo().setFull() : null,
            serializer: JsonConvert.toEpisodes,
        });
    };
}

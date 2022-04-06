import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";
import { AuthorizationRequirement, ShowMovieType, SyncGetHistoryTypes, SyncGetWatchlistSortTypes, SyncGetWatchlistTypes } from "@/helpers/enums";
import { JsonConvert } from "@/helpers/serializers/JsonConvert";
import type { TraktClient } from "@/trakt/TraktClient";
import type { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
import { TraktExtendedInfo } from "@/trakt/parameters/traktExtendedInfo";
import type { IDictionary } from "@/models/CommonModels";
import type { RequestPagination } from "@/models/RequestModels";
import { isString, isValidDateString } from "@/helpers/Utils";
import type { HistoryItem, WatchedItem, WatchListItem } from "@/models/UsersModels";
import { WatchedItemSerializer } from "@/helpers/serializers/WatchedItemSerializer";
import { WatchListItemSerializer } from "@/helpers/serializers/WatchListItemSerializer";
import type { ShowWatchedProgress } from "@/models/ShowModels";
import { ShowWatchedProgressSerializer } from "@/helpers/serializers/ShowWatchedProgressSerializer";

interface IShowWatchedProgressParams {
    id: string;
    hidden?: boolean | null;
    specials?: boolean | null;
    countSpecials?: boolean | null;
}

// interface ISyncGetWatchedParams {
//     type: ShowMovieType;
//     extendedFull?: boolean;
//     filters?: TraktShowFilter | null;
// }
//
// interface ISyncGetWatchListParams {
//     type?: SyncGetWatchlistTypes | null;
//     sort?: SyncGetWatchlistSortTypes | null;
//     extendedFull?: boolean;
//     requestPagination?: RequestPagination | null;
// }
//
// interface ICommonSyncParams {
//     extendedFull?: boolean | null;
//     queryParams?: IDictionary | null;
//     filters?: TraktShowFilter | null;
//     requestPagination?: RequestPagination | null;
// }

export default class ShowRequests extends TraktApiCategory {
    constructor(traktClient: TraktClient) {
        super(traktClient);
    }

    public getShowWatchedProgress = async ({ id, hidden = false, specials = false, countSpecials = false }: IShowWatchedProgressParams) => {
        const url = `/shows/${id}/progress/watched`;

        const queryParams: IDictionary = {};
        queryParams["hidden"] = hidden;
        queryParams["specials"] = hidden;
        queryParams["count_specials"] = hidden;

        return await this._traktClient.get<ShowWatchedProgress>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            queryParams: queryParams,
            // serializer: ShowWatchedProgressSerializer.toShowWatchedProgress,
            serializer: JsonConvert.toShowWatchedProgress,
        });
    };
}

import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";
import { AuthorizationRequirement, ShowMovieType, SyncGetHistoryTypes, SyncGetWatchlistSortTypes, SyncGetWatchlistTypes } from "@/helpers/enums";
import { JsonConvert } from "@/helpers/serializers/JsonConvert";
import type { TraktClient } from "@/trakt/TraktClient";
import type { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
import { TraktExtendedInfo } from "@/trakt/parameters/traktExtendedInfo";
import type { IDictionary } from "@/models/CommonModels";
import type { RequestPagination } from "@/models/RequestModels";
import { isString, isValidDateString } from "@/helpers/Utils";
import { WatchedItemSerializer } from "@/helpers/serializers/WatchedItemSerializer";
import { WatchListItemSerializer } from "@/helpers/serializers/WatchListItemSerializer";
import { ShowWatchedProgressSerializer } from "@/helpers/serializers/ShowWatchedProgressSerializer";
import type { ShowWatchedProgress } from "@/models/ShowWatchedProgress";
import type { WatchListItem } from "@/models/WatchListItem";
import type { WatchedItem } from "@/models/WatchedItem";
import type { HistoryItem } from "@/models/HistoryItem";

interface IShowWatchedProgressParams {
    id: number;
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

    public getShowWatchedProgress = async ({ id, hidden = false, specials = true, countSpecials = false }: IShowWatchedProgressParams) => {
        const url = `/shows/${id}/progress/watched`;

        const queryParams: IDictionary = {};
        queryParams["hidden"] = hidden;
        queryParams["specials"] = specials;
        queryParams["count_specials"] = countSpecials;

        const response = await this._traktClient.get<ShowWatchedProgress>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            queryParams: queryParams,
            // serializer: ShowWatchedProgressSerializer.toShowWatchedProgress,
            serializer: JsonConvert.toShowWatchedProgress,
        });

        try {
            if (response.content) response!.content!.traktId! = id;
        } catch (e) {
            debugger;
        }
        return response;
    };
}

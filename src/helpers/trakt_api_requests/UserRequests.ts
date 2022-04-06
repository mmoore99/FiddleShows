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
    TraktList
} from "@/models/ListModels";

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

interface IGetListItemsParams {
    id: string
    listId: string
    type?: GetListItemsTypes | null;
    extendedFull?: boolean;
    requestPagination?: RequestPagination | null;
}

export default class UserRequests extends TraktApiCategory {
    constructor(traktClient: TraktClient) {
        super(traktClient);
    }

    public getCustomLists = async (id: string) => {
        const url = `/users/${id}/lists`;

        return await this._traktClient.getList<TraktList>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            // serializer: ShowWatchedProgressSerializer.toShowWatchedProgress,
            serializer: JsonConvert.toTraktList,
        });
    };

    public getListItems = async ({id, listId, type = null, extendedFull = false, requestPagination = null }: IGetListItemsParams) => {
        const URL_TEMPLATE = `/users/${id}/lists/${listId}`;

        let request = "";
        if (type) request += `/${type}`;

        const url = URL_TEMPLATE + request;

        return await this._traktClient.getList<WatchListItem>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            extendedInfo: extendedFull ? new TraktExtendedInfo().setFull() : null,
            requestPagination: requestPagination,
            serializer: JsonConvert.toWatchListItem,
            // serializer: WatchListItemSerializer.toWatchListItem,
        });
    };
}

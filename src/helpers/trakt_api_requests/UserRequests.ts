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
import { WatchedItemSerializer } from "@/helpers/serializers/WatchedItemSerializer";
import { WatchListItemSerializer } from "@/helpers/serializers/WatchListItemSerializer";
import { ShowWatchedProgressSerializer } from "@/helpers/serializers/ShowWatchedProgressSerializer";
import type {
    ShowWatchedProgress
} from "@/models/ShowWatchedProgress";
import type {
    WatchListItem
} from "@/models/WatchListItem";
import type {
    WatchedItem
} from "@/models/WatchedItem";
import type {
    HistoryItem
} from "@/models/HistoryItem";
import type {
    TraktListItem
} from "@/models/TraktListItem";
import type {
    TraktList
} from "@/models/TraktList";

interface IGetListItemsParams {
    id: string
    listId: string | number
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

    public getCustomListItems = async ({id, listId, type = null, extendedFull = false, requestPagination = null }: IGetListItemsParams) => {
        const URL_TEMPLATE = `/users/${id}/lists/${listId}/items`;

        let request = "";
        if (type) request += `/${type}`;

        const url = URL_TEMPLATE + request;

        return await this._traktClient.getList<TraktListItem>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            extendedInfo: extendedFull ? new TraktExtendedInfo().setFull() : null,
            requestPagination: requestPagination,
            serializer: JsonConvert.toTraktListItem,
            // serializer: WatchListItemSerializer.toWatchListItem,
        });
    };
}

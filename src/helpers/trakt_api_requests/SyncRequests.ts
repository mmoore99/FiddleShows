import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";
import type { CalendarMovie, CalendarShow } from "@/models/CalendarModels";
import * as Enums from "@/helpers/enums";
import { AuthorizationRequirement, EntityType } from "@/helpers/enums";
import { JsonConvert } from "@/helpers/serializers/JsonConvert";
import type { TraktClient } from "@/trakt/TraktClient";
import type { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
import { TraktExtendedInfo } from "@/trakt/parameters/traktExtendedInfo";
import type { IDictionary } from "@/models/CommonModels";
import type { RequestPagination } from "@/models/RequestModels";

interface ISyncWatchedHistoryParams {
    type?: string | null;
    id?: number | null;
    startAt?: string | null;
    endAt?: string | null;
    numberOfDays?: number | null;
    extendedFull?: boolean;
    filters?: TraktShowFilter | null;
    requestPagination?: RequestPagination | null;
}

interface ICommonSyncParams {
    extendedFull?: boolean | null;
    queryParams?: IDictionary | null;
    filters?: TraktShowFilter | null;
    requestPagination?: RequestPagination | null;
}

export default class SyncRequests extends TraktApiCategory {
    constructor(traktClient: TraktClient) {
        super(traktClient);
    }

    public syncWatchedHistory = async ({
        type = null,
        id = null,
        startAt = null,
        endAt = null,
        extendedFull = false,
        filters = null,
        requestPagination = null,
    }: ISyncWatchedHistoryParams = {}) => {
        const URL_TEMPLATE = `/sync/history`;

        let request = "";
        if (type) request += `/${type}`;
        if (type && id) request += `${id}`;
        const url = URL_TEMPLATE + request;

        const queryParams: IDictionary = {};
        if (startAt) queryParams["start_at"] = startAt;
        if (endAt) queryParams["start_at"] = endAt;

        return await this._traktClient.getList<HistoryItem>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            queryParams: queryParams,
            extendedInfo: extendedFull ? new TraktExtendedInfo().setFull() : null,
            requestPagination: requestPagination,
            filters: filters,
            serializer: JsonConvert.toHistoryItem,
        });
    };
}

import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";
import { AuthorizationRequirement } from "@/helpers/enums";
import { JsonConvert } from "@/helpers/serializers/JsonConvert";
import type { TraktClient } from "@/trakt/TraktClient";
import type { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
import { TraktExtendedInfo } from "@/trakt/parameters/traktExtendedInfo";
import type { IDictionary } from "@/models/CommonModels";
import type { RequestPagination } from "@/models/RequestModels";
import { isDateObject, isString, isValidDateString } from "@/helpers/Utils";
import type { HistoryItem } from "@/models/UsersModels";
import { ConvertHistoryItemJson } from "@/helpers/serializers/HistoryItemSerializer";

interface ISyncWatchedHistoryParams {
    type?: string | null;
    id?: number | null;
    startAt?: Date | string | null;
    endAt?: Date | string | null;
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

    public getHistory = async ({
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

        if (startAt && isString(startAt) && isValidDateString(startAt as string)) startAt = new Date(startAt);
        if (endAt && isString(endAt) && isValidDateString(endAt as string)) endAt = new Date(endAt);

        const queryParams: IDictionary = {};
        if (startAt) queryParams["start_at"] = (startAt as Date).toISOString().substring(0, 11);
        if (endAt) queryParams["start_at"] = (endAt as Date).toISOString().substring(0, 11);

        return await this._traktClient.getList<HistoryItem>({
            authorizationRequirement: AuthorizationRequirement.Required,
            request: url,
            queryParams: queryParams,
            extendedInfo: extendedFull ? new TraktExtendedInfo().setFull() : null,
            requestPagination: requestPagination,
            filters: filters,
            serializer: JsonConvert.toHistoryItem,
            // serializer: ConvertHistoryItemJson.toHistoryItem,
        });
    };
}

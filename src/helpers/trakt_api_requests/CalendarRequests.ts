import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";
import type { CalendarMovie, CalendarShow } from "@/models/CalendarModels";
import * as Enums from "@/helpers/enums";
import { AuthorizationRequirement, EntityType } from "@/helpers/enums";
import { JsonConvert } from "@/helpers/serializers/JsonConvert";
import type { TraktClient } from "@/trakt/TraktClient";
import type { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
import { TraktExtendedInfo } from "@/trakt/parameters/traktExtendedInfo";

interface ICalendarRequestParams {
    startDate?: string | null;
    numberOfDays?: number | null;
    extendedFull?: boolean;
    filters?: TraktShowFilter | null;
}

export default class CalendarRequests extends TraktApiCategory {
    constructor(traktClient: TraktClient) {
        super(traktClient);
    }

    public getUserShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, filters = null }: ICalendarRequestParams = {}) => {
        const URL_TEMPLATE = `/calendars/my/shows`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.Required, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            filters,
        });
    };

    public getMyNewShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, filters = null }: ICalendarRequestParams = {}) => {
        const URL_TEMPLATE = `/calendars/my/shows/new`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.Required, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            filters,
        });
    };

    public getAllShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, filters = null }: ICalendarRequestParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.NotRequired, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            filters,
        });
    };

    public getNewShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, filters = null }: ICalendarRequestParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows/new`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.NotRequired, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            filters,
        });
    };

    public getSeasonPremiers = async ({ startDate = null, numberOfDays = null, extendedFull = false, filters = null }: ICalendarRequestParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows/premieres`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.NotRequired, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            filters,
        });
    };

    public getAllMovies = async ({ startDate = null, numberOfDays = null, extendedFull = false, filters = null }: ICalendarRequestParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/movies`;
        return this.getCommon<CalendarMovie>(AuthorizationRequirement.NotRequired, Enums.EntityType.movie, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            filters,
        });
    };

    private async getCommon<T>(
        authorizationRequirement: AuthorizationRequirement,
        entityType: Enums.EntityType,
        urlTemplate: string,
        { startDate = null, numberOfDays = null, extendedFull = false, filters = null }: ICalendarRequestParams = {}
    ) {
        if (!((startDate && numberOfDays) || (!startDate && !numberOfDays))) throw "Both startDate and numberOfDays need to be given or both be null";
        let request = startDate ? `/${startDate}/${numberOfDays}` : null;

        const result = await this._traktClient.getList<T>({
            authorizationRequirement: authorizationRequirement,
            request: request ? urlTemplate + request : urlTemplate,
            extendedInfo: extendedFull ? new TraktExtendedInfo().setFull() : null,
            requestPagination: null,
            filters: filters,
            serializer: entityType === EntityType.show ? JsonConvert.toCalendarShow : JsonConvert.toCalendarMovie,
        });

        console.log(result);
        return result;
    }
}

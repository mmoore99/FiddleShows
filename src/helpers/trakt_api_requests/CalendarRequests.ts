import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";
import type { CalendarMovie, CalendarShow } from "@/models/CalendarModels";
import * as Enums from "@/helpers/enums";
import { AuthorizationRequirement, EntityType } from "@/helpers/enums";
import { JsonConvert } from "@/helpers/serializers/JsonConvert";
import type { IDictionary } from "@/models/CommonModels";

interface IParams {
    startDate?: string | null;
    numberOfDays?: number | null;
    extendedFull?: boolean;
    queryParams?: IDictionary;
}

export default class CalendarRequests extends TraktApiCategory {
    constructor(traktClient: any) {
        super(traktClient);
    }

    public getMyShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} }: IParams = {}) => {
        const URL_TEMPLATE = `/calendars/my/shows`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.Required, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            queryParams,
        });
    };

    public getMyNewShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} }: IParams = {}) => {
        const URL_TEMPLATE = `/calendars/my/shows/new`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.Required, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            queryParams,
        });
    };

    public getAllShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} }: IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.NotRequired, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            queryParams,
        });
    };

    public getNewShows = async ({ startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} }: IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows/new`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.NotRequired, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            queryParams,
        });
    };

    public getSeasonPremiers = async ({ startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} }: IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows/premieres`;
        return this.getCommon<CalendarShow>(AuthorizationRequirement.NotRequired, Enums.EntityType.show, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            queryParams,
        });
    };

    public getAllMovies = async ({ startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} }: IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/movies`;
        return this.getCommon<CalendarMovie>(AuthorizationRequirement.NotRequired, Enums.EntityType.movie, URL_TEMPLATE, {
            startDate,
            numberOfDays,
            extendedFull,
            queryParams,
        });
    };

    private async getCommon<T>(
        authorizationRequirement: AuthorizationRequirement,
        entityType: Enums.EntityType,
        urlTemplate: string,
        { startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} }: IParams = {}
    ) {
        if (!((startDate && numberOfDays) || (!startDate && !numberOfDays))) throw "Both startDate and numberOfDays need to be given or both be null";
        let request = startDate ? `/${startDate}/${numberOfDays}` : null;

        const response = await this._traktClient.getList({
            authorizationRequirement: authorizationRequirement,
            request: request ? urlTemplate + request : urlTemplate,
            extendedFull: extendedFull,
            pagination: null,
            queryParams: queryParams,
            serializer: entityType === EntityType.show ? JsonConvert.toCalendarShow : JsonConvert.toCalendarMovie,
        });
        console.log(response);
        return response.data as T[];
    }
}

import { Convert as CalendarShowsSerializer } from "@/helpers/serializers/CalendarShowsSerializer";
import { HttpVerb } from "@/helpers/enums";
import type { CalendarShow } from "@/helpers/serializers/CalendarShowsSerializer";
import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";

interface IParams{
    startDate?: string | null;
    numberOfDays?: number | null;
    extendedFull?: boolean;
    queryParams?: object | null
}

export default class CalendarRequests extends TraktApiCategory {
    constructor(apiSession: any) {
        super(apiSession);
    }
    
    // public getMyShows = async ({startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
    //     const URL_TEMPLATE = `/calendars/my/shows`;
    //     if ( !((startDate && numberOfDays) || (!startDate && !numberOfDays))) throw "Both startDate and numberOfDays need to be given or both be null";
    //     let request = (startDate) ? `/${startDate}/${numberOfDays}` : null;
    //     const response = await this._apiSession.authenticatedGetList({
    //         request: request ? URL_TEMPLATE + request : URL_TEMPLATE,
    //         extendedFull: extendedFull,
    //         pagination: null,
    //         queryParams: queryParams,
    //         serializer: CalendarShowsSerializer.toCalendarShow,
    //     });
    //     console.log(response);
    //     return response;
    // };

    public getMyShows = async ({startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
        const URL_TEMPLATE = `/calendars/my/shows`;
        return this.getShowsCommon(URL_TEMPLATE,{startDate, numberOfDays, extendedFull,queryParams})
    };

    public getMyNewShows = async ({startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
        const URL_TEMPLATE = `/calendars/my/shows/new`;
        return this.getShowsCommon(URL_TEMPLATE,{startDate, numberOfDays, extendedFull,queryParams})
    };

    public getAllShows = async ({startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows`;
        return this.getShowsCommon(URL_TEMPLATE,{startDate, numberOfDays, extendedFull,queryParams})
    };

    public getNewShows = async ({startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows/new`;
        return this.getShowsCommon(URL_TEMPLATE,{startDate, numberOfDays, extendedFull,queryParams})
    };

    public getSeasonPremiers = async ({startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/shows/premiers`;
        return this.getShowsCommon(URL_TEMPLATE,{startDate, numberOfDays, extendedFull,queryParams})
    };

    public getAllMovies = async ({startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
        const URL_TEMPLATE = `/calendars/all/movies`;
        return this.getShowsCommon(URL_TEMPLATE,{startDate, numberOfDays, extendedFull,queryParams})
    };

    private getShowsCommon = async (urlTemplate: string,{startDate = null, numberOfDays = null, extendedFull = false, queryParams = {} } : IParams = {}) => {
        if ( !((startDate && numberOfDays) || (!startDate && !numberOfDays))) throw "Both startDate and numberOfDays need to be given or both be null";
        let request = (startDate) ? `/${startDate}/${numberOfDays}` : null;
        const response = await this._apiSession.authenticatedGetList({
            request: request ? urlTemplate + request : urlTemplate,
            extendedFull: extendedFull,
            pagination: null,
            queryParams: queryParams,
            serializer: CalendarShowsSerializer.toCalendarShow,
        });
        console.log(response);
        return response;
    };
}

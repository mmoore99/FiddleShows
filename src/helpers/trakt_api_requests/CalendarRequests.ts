import { Convert as CalendarShowsSerializer } from "@/helpers/serializers/CalendarShowsSerializer";
import { HttpVerb } from "@/helpers/enums";
import type { CalendarShow } from "@/helpers/serializers/CalendarShowsSerializer";
import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";

export default class CalendarRequests extends TraktApiCategory {
    private calendarsGetShowsUrlTemplate = `/calendars/my/shows`;

    constructor(apiSession: any) {
        super(apiSession);
    }

    public getMyCalendarShows = async ({startDate = "", numberOfDays = null, extendedFull = false, queryParams = {} } = {}) => {
        let request = "";
        if (startDate) request = `/${startDate}`;
        if (numberOfDays) request = `/${numberOfDays}`;
        const response = await this._apiSession.authenticatedGetList({
            request: this.calendarsGetShowsUrlTemplate,
            extendedFull: extendedFull,
            pagination: null,
            queryParams: queryParams,
            serializer: CalendarShowsSerializer.toCalendarShows,
        });
        console.log(response);
        return response;
    };
}

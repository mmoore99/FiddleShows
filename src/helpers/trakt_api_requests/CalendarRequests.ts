import { Convert as CalendarShowsSerializer } from "@/helpers/serializers/CalendarShowsSerializer";
import { HttpVerb } from "@/helpers/enums";
import type { CalendarShow } from "@/helpers/serializers/CalendarShowsSerializer";
import TraktApiCategory from "@/helpers/trakt_api_requests/TraktApiCategory";

export default class CalendarRequests extends TraktApiCategory {
    private calendarsGetShowsUrlTemplate = `/calendars/my/shows`;

    constructor(apiSession: any) {
        super(apiSession);
    }

    public getMyCalendarShows = async () => {
        const response = await this._apiSession.doHttp({
            verb: HttpVerb.get,
            url: this.calendarsGetShowsUrlTemplate,
            queryParams: null,
            postData: null,
            serializer: CalendarShowsSerializer.toCalendarShows,
        });
        console.log(response);
        return response;
    };
}

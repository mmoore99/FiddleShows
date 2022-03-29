import { Convert as CalendarShowsSerializer } from "@/helpers/serializers/CalendarShowsSerializer";
import { HttpVerb } from "@/helpers/enums";
import type { CalendarShow } from "@/helpers/serializers/CalendarShowsSerializer";

export default class CalendarRequests {
    private calendarsGetShowsUrlTemplate = `/calendars/my/shows`;
    private _apiSession: any;

    constructor(apiSession: any) {
        this._apiSession = apiSession;
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


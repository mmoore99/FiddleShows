import { Convert as CalendarShowsSerializer } from "@/helpers/serializers/CalendarShowsSerializer";
import { HttpVerb } from "@/helpers/enums";
import type { CalendarShow } from "@/helpers/serializers/CalendarShowsSerializer";

export default function CalendarRequests(apiSession: any) {
    const calendarsGetShowsUrlTemplate = `/calendars/my/shows`;

    const getMyCalendarShows = async () => {
        const response = await apiSession.doHttp({
            verb: HttpVerb.get,
            url: calendarsGetShowsUrlTemplate,
            queryParams: null,
            postData: null,
            serializer: CalendarShowsSerializer.toCalendarShows,
        });
        console.log(response);
        return response;
    };

    return {
        getMyCalendarShows,
    };
}

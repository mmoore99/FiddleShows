import axios from "axios";
import type { AxiosRequestHeaders, AxiosResponse } from "axios";
import CalendarRequests from "@/helpers/trakt_manager_requests/calendar_requests";
import * as Enums from "@/helpers/enums";

export default function TraktApiSession(isUseProxy = false) {
    const _isUseProxy = isUseProxy;

    const PROXY_URL = "https://fierce-castle-85156.herokuapp.com/";
    const BASE_URL = "https://api.trakt.tv";
    const CLIENT_ID = "f3939aa847cf9df9eb698298ec01c499bd0b8b0d76c0a1920a6e4c04e3130c39";
    const CLIENT_SECRET = "8c1902d0284fad4ff6b052f0fdbfd50be1075088ba5d6f33b218734067568148";
    const ACCESS_TOKEN = "908366de1b222a5cabfda200e6e829633a7c51234ce655d18674b3de5d7e8f4c";
    const TRAKT_VERSION = 2;

    const headers: AxiosRequestHeaders = {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "trakt-api-key": CLIENT_ID,
        "trakt-api-version": TRAKT_VERSION,
        "Content-Type": "application/json",
    };

    const _session = axios.create();
    _session.defaults.baseURL = BASE_URL;
    _session.defaults.headers.common = headers;

    interface DoHttpParams {
        verb: Enums.HttpVerb;
        url: string;
        queryParams?: any;
        postData?: any;
        serializer: (json: string) => any;
    }

    async function doHttp({
        verb,
        url,
        queryParams = null,
        postData = null,
        serializer,
    }: DoHttpParams) {
        let response: AxiosResponse | null = null;
        try {
            switch (verb) {
                case Enums.HttpVerb.get:
                    if (_isUseProxy) url = PROXY_URL + BASE_URL + url;
                    console.log("url:", url);
                    response = await _session.get(url, {
                        params: queryParams,
                        // transformResponse: [
                        //     (data) => {
                        //         return serializer ? serializer(data) : null;
                        //     },
                        // ],
                    });
                    break;
                case Enums.HttpVerb.post:
                    response = await _session.post(url, postData);
                    break;
                case Enums.HttpVerb.put:
                    break;
                case Enums.HttpVerb.delete:
                    break;
                default:
                    throw "Invalid Http verb";
            }
        } catch (e) {
            console.log("Http error:", e);
            debugger;
        }
        return Promise.resolve(response);
    }

    const apiSession = {
        doHttp,
    };

    const _calendar = CalendarRequests(apiSession);

    return {
        Calendar: _calendar
    };
}

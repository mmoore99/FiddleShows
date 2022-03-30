import axios from "axios";
import type { AxiosRequestHeaders, AxiosResponse, AxiosInstance } from "axios";
import CalendarRequests from "@/helpers/trakt_api_requests/CalendarRequests";
import * as Enums from "@/helpers/enums";

interface DoHttpParams {
    verb: Enums.HttpVerb;
    url: string;
    queryParams?: any;
    postData?: any;
    serializer: (json: string) => any;
}

interface ApiCallParams {
    request: string;
    extendedFull?: boolean;
    pagination?: any;
    filters?: any;
    queryParams?: null | {};
    serializer: any;
}

export default class TraktApiSession {
    private PROXY_URL = "https://fierce-castle-85156.herokuapp.com/";
    private BASE_URL = "https://api.trakt.tv";
    private CLIENT_ID = "f3939aa847cf9df9eb698298ec01c499bd0b8b0d76c0a1920a6e4c04e3130c39";
    private CLIENT_SECRET = "8c1902d0284fad4ff6b052f0fdbfd50be1075088ba5d6f33b218734067568148";
    private ACCESS_TOKEN = "908366de1b222a5cabfda200e6e829633a7c51234ce655d18674b3de5d7e8f4c";
    private TRAKT_VERSION = 2;

    private _commonHeaders: AxiosRequestHeaders = {
        "Content-Type": "application/json",
        "trakt-api-key": this.CLIENT_ID,
        "trakt-api-version": this.TRAKT_VERSION,
    };

    private _authorizationHeader = { Authorization: `Bearer ${this.ACCESS_TOKEN}` };

    private _session: AxiosInstance;
    private _calendar = new CalendarRequests(this);
    private readonly _isUseProxy: boolean;

    public Calendar = this._calendar;

    constructor(isUseProxy: boolean) {
        this._isUseProxy = isUseProxy;
        const self = this;

        this._session = axios.create();
        this._session.defaults.baseURL = this.BASE_URL;
        this._session.defaults.headers.common = this._commonHeaders;
    }

    doHttp = async ({
        verb,
        url,
        queryParams = null,
        postData = null,
        serializer,
    }: DoHttpParams) => {
        let response: AxiosResponse | null = null;
        try {
            switch (verb) {
                case Enums.HttpVerb.get:
                    if (this._isUseProxy) url = this.PROXY_URL + this.BASE_URL + url;
                    console.log("url:", url);
                    response = await this._session.get(url, {
                        params: queryParams,
                        // transformResponse: [
                        //     (data) => {
                        //         return serializer ? serializer(data) : null;
                        //     },
                        // ],
                    });
                    break;
                case Enums.HttpVerb.post:
                    response = await this._session.post(url, postData);
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
    };

    authenticatedGetList = async ({
        request = "",
        extendedFull = false,
        pagination = null,
        filters = null,
        queryParams = null,
        serializer = null,
    }: ApiCallParams) => {
        let response: AxiosResponse | null = null;
        try {
            queryParams = queryParams ?? {};

            queryParams = Object.assign(queryParams, pagination);
            queryParams = Object.assign(queryParams, filters);

            if (extendedFull) {
                // @ts-ignore
                queryParams["extended"] = "full";
            }
            let headers = this._commonHeaders;
            headers = Object.assign(headers, this._authorizationHeader);
            let url = this.BASE_URL + request;
            if (this._isUseProxy) url = this.PROXY_URL + url;
            console.log("url:", url);

            response = await this._session.get(url, {
                headers: headers,
                data: {}, // this is required to prevent axios from removing content-type header
                params: queryParams,
                transformResponse: [
                    (data) => {
                        try {
                            return serializer ? serializer(data) : null;
                        } catch (e) {
                            console.log("Exception during deserialization", e);
                            return null;
                        }
                    },
                ],
            });
        } catch (e) {
            console.log("Http error:", e);
        }
        return Promise.resolve(response);
    };
}

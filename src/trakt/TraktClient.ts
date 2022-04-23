import type { AxiosInstance, AxiosRequestHeaders, AxiosResponse } from "axios";
import type { IDictionary } from "@/models/CommonModels";
import axios from "axios";
import CalendarRequests from "@/helpers/trakt_api_requests/CalendarRequests";
import { AuthorizationRequirement } from "@/helpers/enums";
import { TraktPagedResponse, TraktResponse } from "@/trakt/responses/TraktResponses";
import { ResponseHeaderParser } from "@/trakt/handlers/ResponseHeaderParser";
import type { ATraktFilter } from "@/trakt/parameters/filters/TraktFilters";
import type { RequestPagination } from "@/models/RequestModels";
import type { TraktExtendedInfo } from "@/trakt/parameters/traktExtendedInfo";
import SyncRequests from "@/helpers/trakt_api_requests/SyncRequests";
import ShowRequests from "@/helpers/trakt_api_requests/ShowRequests";
import UserRequests from "@/helpers/trakt_api_requests/UserRequests";
import SeasonRequests from "@/helpers/trakt_api_requests/SeasonRequests";

interface IApiCallParams {
    authorizationRequirement: AuthorizationRequirement;
    request: string;
    extendedInfo?: TraktExtendedInfo | null;
    requestPagination?: RequestPagination | null;
    filters?: ATraktFilter | null;
    queryParams?: null | IDictionary;
    serializer: any;
    isNoCache?: boolean
}

export class TraktClient {
    private PROXY_URL = "https://fierce-castle-85156.herokuapp.com/";
    private BASE_URL = "https://api.trakt.tv";
    private TRAKT_VERSION = 2;

    private _session: AxiosInstance;
    private readonly _clientSecret: string;
    private readonly _commonHeaders: AxiosRequestHeaders = {};
    private readonly _noCacheHeaders: AxiosRequestHeaders = {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',    
    };
    private readonly _clientId: string;
    private readonly _accessToken: string;
    private readonly _isUseProxy: boolean;
    private readonly _authorizationHeader: {} | null = null;

    private _calendars = new CalendarRequests(this);
    private _sync = new SyncRequests(this);
    private _shows = new ShowRequests(this);
    private _users = new UserRequests(this);
    private _seasons = new SeasonRequests(this);

    public Calendars = this._calendars;
    public Sync = this._sync;
    public Shows = this._shows;
    public Users = this._users;
    public Seasons = new SeasonRequests(this);

    constructor({ clientId = "", clientSecret = "", accessToken = "", isUseProxy = false }) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._accessToken = accessToken;
        this._isUseProxy = isUseProxy;

        this._session = axios.create();
        this._session.defaults.baseURL = this.BASE_URL;
        this._session.defaults.headers.common = this._commonHeaders;

        this._authorizationHeader = { Authorization: `Bearer ${this._accessToken}` };

        this._commonHeaders = {
            "Content-Type": "application/json",
            "trakt-api-key": this._clientId,
            "trakt-api-version": this.TRAKT_VERSION,
        };
    }

    async get<T>({
        authorizationRequirement = AuthorizationRequirement.NotRequired,
        request = "",
        extendedInfo = null,
        queryParams = null,
        serializer = null,
        isNoCache = true
    }: IApiCallParams): Promise<TraktPagedResponse<T>> {
        let result = new TraktResponse<T>();
        let response: AxiosResponse | null = null;
        try {
            queryParams = queryParams ?? {};
            if (extendedInfo?.hasAnySet()) queryParams["extended"] = extendedInfo.toString();
            if (isNoCache) queryParams["cache-buster"] = new Date().getTime();


            let headers = this._commonHeaders;
            if (authorizationRequirement !== AuthorizationRequirement.NotRequired) headers = Object.assign(headers, this._authorizationHeader);
            // if (isNoCache) headers = Object.assign(headers, this._noCacheHeaders);

            let url = this.BASE_URL + request;
            if (this._isUseProxy) url = this.PROXY_URL + url;

            console.log("url:", url);
            console.log("queryParams:", JSON.stringify(queryParams, null, 2));
            console.log("http headers=", headers);

            response = await this._session.get(url, {
                headers: headers,
                data: {}, // this is required to prevent axios from removing content-type header
                params: queryParams,
                transformResponse: [
                    (data) => {
                        if (!data) return null;
                        try {
                            return serializer ? serializer(data) : null;
                        } catch (e) {
                            console.error("Exception during deserialization", e);
                            console.error("Data:", data);
                            result.Exception = e;
                            return null;
                        }
                    },
                ],
            });
        } catch (e) {
            console.error("Http error:", e);
        }

        if (response && (response.statusText.toLowerCase() === "ok" || response.status === 200|| response.status === 201 || response.status === 204) && response.data !== null) {
            result.IsSuccess = true;
            result.content = response.data;
            result.Exception = null;
            new ResponseHeaderParser().parseResponseHeaders(response.headers, result);
        } else {
            result.IsSuccess = false;
            result.content = null;
        }
        console.log("Exiting Get: response = ", response, "result= ", result);
        return result;
    }

    async getList<T>({
        authorizationRequirement = AuthorizationRequirement.NotRequired,
        request = "",
        extendedInfo = null,
        requestPagination = null,
        filters = null,
        queryParams = null,
        serializer = null,
        isNoCache = true
    }: IApiCallParams): Promise<TraktPagedResponse<T[]>> {
        let result = new TraktPagedResponse<T[]>();
        let response: AxiosResponse | null = null;
        try {
            queryParams = queryParams ?? {};
            queryParams = Object.assign(queryParams, requestPagination?.toMap());
            queryParams = Object.assign(queryParams, filters?.toMap());
            if (extendedInfo?.hasAnySet()) queryParams["extended"] = extendedInfo.toString();
            if (isNoCache) queryParams["cache-buster"] = new Date().getTime();

            let headers = this._commonHeaders;
            if (authorizationRequirement !== AuthorizationRequirement.NotRequired) {
                headers = Object.assign(headers, this._authorizationHeader);
            }

            let url = this.BASE_URL + request;
            if (this._isUseProxy) url = this.PROXY_URL + url;

            console.log("url:", url);
            console.log("queryParams:", JSON.stringify(queryParams, null, 2));
            console.log("http headers=", headers);

            response = await this._session.get(url, {
                headers: headers,
                data: {}, // this is required to prevent axios from removing content-type header
                params: queryParams,
                transformResponse: [
                    (data) => {
                        if (!data) return null;
                        try {
                            return serializer ? serializer(data) : null;
                        } catch (e) {
                            console.error("Exception during deserialization", e);
                            result.Exception = e;
                            return null;
                        }
                    },
                ],
            });
        } catch (e) {
            console.error("Http error:", e);
        }

        if (response && (response.statusText.toLowerCase() === "ok" || response.status === 200|| response.status === 201 || response.status === 204) && response.data !== null) {
            result.IsSuccess = true;
            response.statusText = "ok";
            result.content = response.data;
            result.Exception = null;
            new ResponseHeaderParser().parseResponseHeaders(response.headers, result);
        } else {
            result.IsSuccess = false;
            result.content = null;
        }
        console.log("Exiting GetList: response = ", response, "result= ", result);
        return result;
    }
}

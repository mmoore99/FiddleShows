import type { TraktResponse } from "@/trakt/responses/TraktResponses";
import type { IDictionary, RateLimit } from "@/models/CommonModels";
import type { TraktPagedResponse } from "@/trakt/responses/TraktResponses";

export class ResponseHeaderParser {
    private HEADER_PAGINATION_PAGE_KEY = "x-pagination-page";
    private HEADER_PAGINATION_LIMIT_KEY = "x-pagination-limit";
    private HEADER_PAGINATION_PAGE_COUNT_KEY = "x-pagination-page-count";
    private HEADER_PAGINATION_ITEM_COUNT_KEY = "x-pagination-item-count";
    private HEADER_TRENDING_USER_COUNT_KEY = "x-trending-user-count";
    private HEADER_SORT_BY_KEY = "x-sort-by";
    private HEADER_SORT_HOW_KEY = "x-sort-how";
    private HEADER_STARTDATE_KEY = "x-start-date";
    private HEADER_ENDDATE_KEY = "x-end-date";
    private HEADER_PRIVATE_USER_KEY = "x-private-user";
    private HEADER_ITEM_ID = "x-item-id";
    private HEADER_ITEM_TYPE = "x-item-type";
    private HEADER_APPLIED_SORT_BY = "x-applied-sort-by";
    private HEADER_APPLIED_SORT_HOW = "x-applied-sort-how";
    private HEADER_RATE_LIMIT = "x-ratelimit";
    private HEADER_RETRY_AFTER = "retry-after";
    private HEADER_UPGRADE_URL = "x-upgrade-url";
    private HEADER_FINAL_URL = "x-final-url";
    private HEADER_RUNTIME = "x-runtime";

    parseResponseHeaders(responseHeaders: IDictionary, traktResponse: TraktPagedResponse<any>) {
        for (let i = 0; i < responseHeaders.length; i++) {
            responseHeaders[i] = responseHeaders[i].toLowerCase();
        }
        traktResponse.page = responseHeaders[this.HEADER_PAGINATION_PAGE_KEY] ?? null;
        traktResponse.pageCount = responseHeaders[this.HEADER_PAGINATION_PAGE_COUNT_KEY] ?? null;
        traktResponse.itemCount = responseHeaders[this.HEADER_PAGINATION_ITEM_COUNT_KEY] ?? null;
        traktResponse.limit = responseHeaders[this.HEADER_PAGINATION_LIMIT_KEY] ?? null;
        traktResponse.trendingUserCount = responseHeaders[this.HEADER_TRENDING_USER_COUNT_KEY] ?? null;
        traktResponse.sortBy = responseHeaders[this.HEADER_SORT_BY_KEY] ?? null;
        traktResponse.sortHow = responseHeaders[this.HEADER_SORT_HOW_KEY] ?? null;
        traktResponse.startDate = responseHeaders[this.HEADER_STARTDATE_KEY] ? new Date(responseHeaders[this.HEADER_STARTDATE_KEY]) : null;
        traktResponse.endDate = responseHeaders[this.HEADER_ENDDATE_KEY] ? new Date(responseHeaders[this.HEADER_ENDDATE_KEY]) : null;
        traktResponse.isPrivateUser = responseHeaders[this.HEADER_PRIVATE_USER_KEY] ?? null;
        traktResponse.itemId = responseHeaders[this.HEADER_ITEM_ID] ?? null;
        traktResponse.itemType = responseHeaders[this.HEADER_ITEM_TYPE] ?? null;
        traktResponse.appliedSortBy = responseHeaders[this.HEADER_APPLIED_SORT_BY] ?? null;
        traktResponse.appliedSortHow = responseHeaders[this.HEADER_APPLIED_SORT_HOW] ?? null;
        traktResponse.rateLimit = responseHeaders[this.HEADER_RATE_LIMIT] ? this.parseRateLimit(responseHeaders[this.HEADER_RATE_LIMIT]) : null;
        traktResponse.retryAfter = responseHeaders[this.HEADER_RETRY_AFTER] ?? null;
        traktResponse.upgradeUrl = responseHeaders[this.HEADER_UPGRADE_URL] ?? null;
        traktResponse.finalUrl = responseHeaders[this.HEADER_FINAL_URL] ?? null;
        traktResponse.runtime = responseHeaders[this.HEADER_RUNTIME] ?? null;
    }

    parseRateLimit(jsonString: string) {
        const result: RateLimit = JSON.parse(jsonString);
        result.until = new Date(result.until);
        return result;
    }
}

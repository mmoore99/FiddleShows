import type {
    RateLimit
} from "@/models/CommonModels";

export class TraktNoContentResponse {
    public IsSuccess: boolean = false;
    public Exception: any = null;
}

export class TraktResponse<TResponseContentType> extends TraktNoContentResponse {
    public content: TResponseContentType | null = null;
    public sortBy: string = "";
    public sortHow: string = "";
    public appliedSortBy: string = "";
    public appliedSortHow: string = "";
    public startDate: Date | null = null;
    public endDate: Date | null = null;
    public trendingUserCount: number | null = null;
    public page: number | null = null;
    public limit: number | null = null;
    public itemId: number | null = null;
    public retryAfter: number | null = null;
    public itemType: string = "";
    public rateLimit: RateLimit | null = null;
    public upgradeUrl: string = "";
    public isPrivateUser: boolean = false;

    public hasValue(){
        return !!this.content;
    }

}

export class TraktPagedResponse<TResponseContentType> extends TraktResponse<TResponseContentType> {
    public pageCount?: number | null = null;
    public itemCount?: number | null = null;
}

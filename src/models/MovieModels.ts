import type { Ids } from "@/models/CommonModels";

export interface Movie {
    title?: string;
    year?: number;
    ids?: Ids;
    overview?: null | string;
    released?: Date;
    runtime?: number;
    certification?: null | string;
    network?: null | string;
    country?: null | string;
    trailer?: null | string;
    tagline?: null | string;
    homepage?: null | string;
    status?: string;
    rating?: number;
    votes?: number;
    commentCount?: number;
    updatedAt?: Date;
    language?: null | string;
    availableTranslations?: string[];
    genres?: string[];
}

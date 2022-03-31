import type { Ids } from "@/models/CommonModels";

export interface Episode {
    season?: number;
    number?: number;
    title?: null | string;
    ids?: Ids;
    numberAbs?: null;
    overview?: null | string;
    rating?: number;
    votes?: number;
    commentCount?: number;
    firstAired?: Date;
    updatedAt?: Date;
    availableTranslations?: string[];
    runtime?: number;
}

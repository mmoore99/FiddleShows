import type { Airs } from "@/models/CommonModels";
import type { Season } from "@/models/Season";
import type { Ids } from "@/models/Ids";
import { Type } from "class-transformer";
export class Show {
    title?: string;
    year?: number;
    ids?: Ids;
    overview?: null | string;

    @Type(() => Date)
    firstAired?: Date;

    airs?: Airs;
    runtime?: number;
    certification?: null | string;
    network?: null | string;
    country?: null | string;
    trailer?: null | string;
    homepage?: null | string;
    status?: string;
    rating?: number;
    votes?: number;
    commentCount?: number;
    
    @Type(() => Date)
    updatedAt?: Date;
    
    language?: null | string;
    availableTranslations?: string[];
    genres?: string[];
    airedEpisodes?: number;
    seasons?: Season[];
}

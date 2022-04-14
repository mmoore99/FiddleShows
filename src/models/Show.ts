import type { Airs} from "@/models/CommonModels";
import type {
    Season
} from "@/models/Season";
import type {
    Ids
} from "@/models/Ids";

export interface Show {
    title?: string;
    year?: number;
    ids?: Ids;
    overview?: null | string;
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
    updatedAt?: Date;
    language?: null | string;
    availableTranslations?: string[];
    genres?: string[];
    airedEpisodes?: number;
    seasons: Season[];
}

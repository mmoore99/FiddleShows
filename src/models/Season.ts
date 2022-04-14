import type {
    Episode
} from "@/models/Episode";
import type {
    Ids
} from "@/models/Ids";

export interface Season {
    // Extended: metadata (minimum data provided)
    number: number;
    ids: Ids;

    //Extended: full
    title?: string;
    overview?: string;
    network?: string;
    rating?: number;
    votes?: number;
    episodeCount?: number;
    airedEpisodes?: number;
    firstAired?: Date;
    updatedAt?: Date;
    episodes?: Episode[];
}

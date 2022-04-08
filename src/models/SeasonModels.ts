import type { Airs, Ids } from "@/models/CommonModels";
import type { Episode, WatchedEpisode } from "@/models/EpisodeModels";

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

export interface WatchedSeason {
    number?: number;
    episodes?: WatchedEpisode[];
}

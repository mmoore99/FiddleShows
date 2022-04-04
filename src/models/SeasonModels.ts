import type { Airs, Ids } from "@/models/CommonModels";
import type { Episode, WatchedEpisode } from "@/models/EpisodeModels";

export interface WatchedSeason {
    number?: number;
    episodes?: WatchedEpisode[];
}

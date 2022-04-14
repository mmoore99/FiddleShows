import type {
    WatchedEpisode
} from "@/models/WatchedEpisode";

export interface WatchedSeason {
    number?: number;
    episodes?: WatchedEpisode[];
}

import type { Episode } from "@/models/EpisodeModels";
import type { Show } from "@/models/ShowModels";
import type { Movie } from "@/models/MovieModels";
import type { WatchedSeason } from "@/models/SeasonModels";

export interface HistoryItem {
    id?: number;
    watchedAt?: Date;
    action?: string;
    type?: string;
    episode?: Episode;
    show?: Show;
}

export interface WatchedItem {
    plays?: number;
    lastWatchedAt?: Date;
    lastUpdatedAt?: Date;
    resetAt?: null;
    show?: Show;
    seasons?: WatchedSeason[];
}

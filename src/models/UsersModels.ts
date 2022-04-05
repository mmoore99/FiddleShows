import type { Episode } from "@/models/EpisodeModels";
import type { Show } from "@/models/ShowModels";
import type { Movie } from "@/models/MovieModels";
import type { Season, WatchedSeason } from "@/models/SeasonModels";
import type { SyncGetWatchlistTypes } from "@/helpers/enums";

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

export interface WatchListItem {
    rank: number;
    listedAt: Date;
    type: SyncGetWatchlistTypes;
    movie?: Movie;
    episode?: Episode;
    season?: Season;
    show?: Show;
}

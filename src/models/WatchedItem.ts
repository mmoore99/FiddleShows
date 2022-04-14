import type { Show } from "@/models/Show";
import type { WatchedSeason } from "@/models/WatchedSeason";
import type {
    Movie
} from "@/models/Movie";

export interface WatchedItem {
    plays?: number;
    lastWatchedAt?: Date;
    lastUpdatedAt?: Date;
    resetAt?: null;
    show?: Show;
    movie?: Movie;
    seasons?: WatchedSeason[];
}

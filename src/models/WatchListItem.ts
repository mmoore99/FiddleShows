import type { SyncGetWatchlistTypes } from "@/helpers/enums";
import type { Season } from "@/models/Season";
import type { Show } from "@/models/Show";
import type {
    Episode
} from "@/models/Episode";
import type {
    Movie
} from "@/models/Movie";

export interface WatchListItem {
    rank: number;
    listedAt: Date;
    type: SyncGetWatchlistTypes;
    movie?: Movie;
    episode?: Episode;
    season?: Season;
    show?: Show;
}

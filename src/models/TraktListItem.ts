import type { SyncGetWatchlistTypes } from "@/helpers/enums";
import type { Movie } from "@/models/Movie";
import type { Episode } from "@/models/Episode";
import type { Season } from "@/models/Season";
import type { Show } from "@/models/Show";
import type { Person } from "@/models/Person";

export interface TraktListItem {
    id: number;
    rank: number;
    listedAt: Date;
    notes?: string;
    type: SyncGetWatchlistTypes;
    movie?: Movie;
    episode?: Episode;
    season?: Season;
    show?: Show;
    person?: Person;
}

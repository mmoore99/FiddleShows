import type { Episode } from "@/models/EpisodeModels";
import type { Show } from "@/models/ShowModels";
import type { Movie } from "@/models/MovieModels";

export interface HistoryItem {
    id?:        number;
    watchedAt?: Date;
    action?:    string;
    type?:      string;
    episode?:   Episode;
    show?:      Show;
}



import type { Episode } from "@/models/EpisodeModels";
import type { Show } from "@/models/ShowModels";
import type { Movie } from "@/models/MovieModels";

export interface CalendarShow {
    firstAired?: Date;
    episode?: Episode;
    show?: Show;
}

export interface CalendarMovie {
    movie?: Movie;
    released?: Date;
}



import type {
    Movie
} from "@/models/Movie";

export interface CalendarMovie {
    movie?: Movie;
    released?: Date;
}

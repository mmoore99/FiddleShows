import type { Show } from "@/models/Show";
import type {
    Episode
} from "@/models/Episode";

export interface CalendarShow {
    firstAired?: Date;
    episode?: Episode;
    show?: Show;
}

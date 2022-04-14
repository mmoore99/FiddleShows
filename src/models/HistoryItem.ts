import type { Show } from "@/models/Show";
import type {
    Episode
} from "@/models/Episode";

export interface HistoryItem {
    id?: number;
    watchedAt?: Date;
    action?: string;
    type?: string;
    episode?: Episode;
    show?: Show;
}

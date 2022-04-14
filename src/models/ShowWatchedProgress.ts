import type {
    ShowSeasonProgress
} from "@/models/ShowSeasonProgress";
import type {
    Episode
} from "@/models/Episode";

export interface ShowWatchedProgress {
    traktId: string;
    aired: number;
    completed: number;
    resetAt?: Date;
    lastWatchedAt?: Date;
    hiddenSeasons?: ShowSeasonProgress[];
    Seasons?: ShowSeasonProgress[];
    nextEpisode?: Episode | null;
    lastEpisode?: Episode | null;
}

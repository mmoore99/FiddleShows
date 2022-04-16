import { ShowSeasonProgress } from "@/models/ShowSeasonProgress";
import type { Episode } from "@/models/Episode";
import { Type } from "class-transformer";

export class ShowWatchedProgress {
    traktId: string = "";
    aired: number = 0;
    completed: number = 0;
    @Type(() => Date) resetAt?: Date;
    @Type(() => Date) lastWatchedAt?: Date;
    hiddenSeasons?: ShowSeasonProgress[];
    @Type(() => ShowSeasonProgress) seasons?: ShowSeasonProgress[];
    nextEpisode?: Episode | null;
    lastEpisode?: Episode | null;
}

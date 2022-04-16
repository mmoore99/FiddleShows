import { Type } from "class-transformer";

export class ShowEpisodeProgress {
    number: number = 0;
    completed: boolean = false;
    @Type(() => Date) lastWatchedAt?: Date | null;
}

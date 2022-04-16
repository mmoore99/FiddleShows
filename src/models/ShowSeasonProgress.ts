import { ShowEpisodeProgress } from "@/models/ShowEpisodeProgress";
import { Type } from "class-transformer";

export class ShowSeasonProgress {
    number: number = 0;
    aired: number = 0;
    completed: number = 0;
    title: string = "";
    @Type(() => ShowEpisodeProgress) episodes: ShowEpisodeProgress[] = [];
}

import { EpisodeContext } from "@/models/EpidodeContext";
import { ShowSeasonProgress } from "@/models/ShowSeasonProgress";
import { Type } from "class-transformer";
import { Season } from "@/models/Season";

export class SeasonContext {
    @Type(() => Season)
    season: Season | null = null;

    @Type(() => ShowSeasonProgress)
    progress: ShowSeasonProgress | null = null;

    isDisplayEpisodes = false;

    @Type(() => EpisodeContext)
    episodeContexts: EpisodeContext[] = [];

    constructor(season: Season) {
        if (season) {
            this.season = season;
        }
    }

    isSomeWatched() {
        return this.progress && this.progress.completed > 0 && this.progress.completed < this.progress.aired;
    }

    isAllWatched() {
        return this.progress && this.progress.completed > 0 && this.progress.aired === this.progress.completed;
    }

    isNoneWatched() {
        return !this.progress || this.progress.completed === 0;
    }
}

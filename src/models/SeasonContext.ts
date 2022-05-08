import type { Season } from "@/models/Season";
import type { EpisodeContext } from "@/models/EpidodeContext";
import type { ShowSeasonProgress } from "@/models/ShowSeasonProgress";

export class SeasonContext {
    season: Season | null = null;
    progress: ShowSeasonProgress | null = null;
    episodeContexts: EpisodeContext[] = [];
    isDisplayEpisodes = false;

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

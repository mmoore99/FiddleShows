import type { Season } from "@/models/Season";
import type { Episode } from "@/models/Episode";
import type { ShowEpisodeProgress } from "@/models/ShowEpisodeProgress";

export class EpisodeContext {
    episode: Episode | null = null;
    progress: ShowEpisodeProgress | null = null;

    constructor(episode: Episode) {
        if (episode) {
            this.episode = episode;
        }
    }

    isWatched() {
        return this.progress && this.progress.completed;
    }
}

import type { Season } from "@/models/Season";
import { Episode } from "@/models/Episode";
import { ShowEpisodeProgress } from "@/models/ShowEpisodeProgress";
import { Type } from "class-transformer";

export class EpisodeContext {
    @Type(() => Episode)
    episode: Episode | null = null;
    
    @Type(() => ShowEpisodeProgress)
    progress: ShowEpisodeProgress | null = null;

    constructor(episode: Episode) {
        if (episode) {
            this.episode = episode;
        }
    }

    isWatched() {
        return this.progress && this.progress.completed;
    }

    formattedAiredDate() {
        // console.log("formattedAiredDate:episode", this.episode);
        // console.log("formattedAiredDate:episode.firstAired", this.episode?.firstAired);
            if (this.episode!.firstAired === null) return "not available";
            return this.episode?.firstAired?.toLocaleDateString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
    }
}

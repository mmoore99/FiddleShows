import type { ShowDisplayCategories } from "@/helpers/enums";
import { ShowWatchedProgress } from "@/models/ShowWatchedProgress";
import { Show } from "@/models/Show";
import { Type } from "class-transformer";
import { ShowWatchedProgressSerializer } from "@/helpers/serializers/ShowWatchedProgressSerializer";
import  { SeasonContext } from "@/models/SeasonContext";

export class ShowContext {
    traktId: number | null = null;
    title: string = "";
    rank: number | null = null;
    isInWatchList = false;
    isContainsSpecials = false

    @Type(() => Show)
    show: Show | null = null;

    @Type(() => SeasonContext)
    seasonContexts: SeasonContext[] = [];

    @Type(() => ShowWatchedProgress)
    progress: ShowWatchedProgress | null = null;

    displayCategory: ShowDisplayCategories | null = null;

    constructor(show?: Show) {
        if (show) {
            this.show = show;
            this.traktId = show.ids?.trakt ? show!.ids!.trakt! : null;
            this.title = show!.title!;
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

    nextEpisodeDisplay() {
        if (this.isNoneWatched()) return "S01E01";
        if (!this.progress!.nextEpisode) return "Next episode unknown";
        return `Up Next: S${this.progress!.nextEpisode!.season!.toString().padStart(2, "0")}E${this.progress!.nextEpisode!.number!.toString().padStart(2, "0")}`;
    }

    episodesLeftDisplay() {
        if (this.isNoneWatched()) return `${this.show?.airedEpisodes} ${this.show?.airedEpisodes === 1 ? "episode" : "episodes"} left`;
        if (!this.progress!.nextEpisode) return "";
        const episodesLeft = this.progress!.aired - this.progress!.completed;
        if (episodesLeft > 0) return `${episodesLeft} ${episodesLeft === 1 ? "episode" : "episodes"} left`;
        return "";
        // if (this.progress.nextEpisode)
        // return `S${this.progress!.nextEpisode!.season!.toString().padStart(2, '0')}E${this.progress!.nextEpisode!.number!.toString().padStart(2, '0')}`
    }
}

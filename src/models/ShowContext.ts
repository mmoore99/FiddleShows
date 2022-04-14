import type { ShowDisplayCategories } from "@/helpers/enums";
import type {
    ShowWatchedProgress
} from "@/models/ShowWatchedProgress";
import type {
    Show
} from "@/models/Show";

export class ShowContext {
    traktId: string = "";
    title: string;
    rank: number | null = null;
    show: Show | null = null;
    isInWatchList = false;
    progress: ShowWatchedProgress | null = null;
    displayCategory: ShowDisplayCategories | null = null;

    constructor(show: Show) {
        this.show = show;
        this.traktId = show!.ids!.trakt!;
        this.title = show!.title!;
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
        if (!this.progress || !this.progress.nextEpisode) return "Next episode unknown";
        return `Up Next: S${this.progress!.nextEpisode!.season!.toString().padStart(2, '0')}E${this.progress!.nextEpisode!.number!.toString().padStart(2, '0')}`
    }

    episodesLeftDisplay() {
        if (!this.progress || !this.progress.nextEpisode) return "";
        const episodesLeft = this.progress.aired - this.progress.completed;
        if (episodesLeft > 0) return `${episodesLeft} ${episodesLeft === 1 ? "episode" : "episodes"} left`;
        return ""
        // if (this.progress.nextEpisode)
        // return `S${this.progress!.nextEpisode!.season!.toString().padStart(2, '0')}E${this.progress!.nextEpisode!.number!.toString().padStart(2, '0')}`
    }
}

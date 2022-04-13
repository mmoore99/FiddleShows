import type { Show, ShowWatchedProgress } from "@/models/ShowModels";
import type { ShowDisplayCategories } from "@/helpers/enums";

export class ShowContext {
    traktId: number | null = null;
    rank: number | null = null;
    show: Show | null = null;
    isInWatchList = false;
    progress: ShowWatchedProgress | null = null;
    displayCategory: ShowDisplayCategories | null = null;

    constructor(show: Show) {
        this.show = show;
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

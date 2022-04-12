import type { Show, ShowWatchedProgress } from "@/models/ShowModels";

export class ShowContext {
    rank: number | null = null;
    show: Show | null = null;
    progress: ShowWatchedProgress | null = null;

    constructor(show: Show) {
        this.show = show;
    }
}

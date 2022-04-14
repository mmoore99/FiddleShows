import type {
    ShowEpisodeProgress
} from "@/models/ShowEpisodeProgress";

export interface ShowSeasonProgress {
    number: number;
    aired: number;
    completed: number;
    title: string;
    episodes: ShowEpisodeProgress[];
}
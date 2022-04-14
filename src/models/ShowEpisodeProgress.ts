export interface ShowEpisodeProgress {
    number: number;
    completed: boolean;
    lastWatchedAt?: Date | null;
}
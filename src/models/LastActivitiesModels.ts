export interface LastActivities {
    all?:             Date;
    movies?:          MoviesActivities;
    episodes?:        EpisodesActivities;
    shows?:           ShowsActivities;
    seasons?:         SeasonsActivities;
    comments?:        CommentsActivities;
    lists?:           ListsActivities;
    watchlist?:       RecommendationsActivities;
    recommendations?: RecommendationsActivities;
    account?:         AccountActivities;
}

export interface AccountActivities {
    settingsAt?:  Date;
    followedAt?:  Date;
    followingAt?: Date;
    pendingAt?:   Date;
}

export interface CommentsActivities {
    likedAt?:   Date;
    blockedAt?: Date;
}

export interface EpisodesActivities {
    watchedAt?:     Date;
    collectedAt?:   Date;
    ratedAt?:       Date;
    watchlistedAt?: Date;
    commentedAt?:   Date;
    pausedAt?:      Date;
}

export interface ListsActivities {
    likedAt?:     Date;
    updatedAt?:   Date;
    commentedAt?: Date;
}

export interface MoviesActivities {
    watchedAt?:         Date;
    collectedAt?:       Date;
    ratedAt?:           Date;
    watchlistedAt?:     Date;
    recommendationsAt?: Date;
    commentedAt?:       Date;
    pausedAt?:          Date;
    hiddenAt?:          Date;
}

export interface RecommendationsActivities {
    updatedAt?: Date;
}

export interface SeasonsActivities {
    ratedAt?:       Date;
    watchlistedAt?: Date;
    commentedAt?:   Date;
    hiddenAt?:      Date;
}

export interface ShowsActivities {
    ratedAt?:           Date;
    watchlistedAt?:     Date;
    recommendationsAt?: Date;
    commentedAt?:       Date;
    hiddenAt?:          Date;
}
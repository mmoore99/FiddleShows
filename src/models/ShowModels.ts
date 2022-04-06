import type { Airs, Ids } from "@/models/CommonModels";
import type {
    Season
} from "@/models/SeasonModels";
import type {
    Episode
} from "@/models/EpisodeModels";

export interface Show {
    title?: string;
    year?: number;
    ids?: Ids;
    overview?: null | string;
    firstAired?: Date;
    airs?: Airs;
    runtime?: number;
    certification?: null | string;
    network?: null | string;
    country?: null | string;
    trailer?: null | string;
    homepage?: null | string;
    status?: string;
    rating?: number;
    votes?: number;
    commentCount?: number;
    updatedAt?: Date;
    language?: null | string;
    availableTranslations?: string[];
    genres?: string[];
    airedEpisodes?: number;
}

export interface ShowWatchedProgress {
    aired:number
    completed:number
    resetAt?: Date
    lastWatchedAt?:Date
    hiddenSeasons?: ShowSeasonProgress[]
    nextEpisode?: Episode
    lastEpisode?: Episode
}

export interface ShowSeasonProgress {
    number:number
    aired:number
    completed:number
    title:string
    episodes: ShowEpisodeProgress[]
    
}

export interface ShowEpisodeProgress {
    number:number
    completed:boolean
    lastWatchedAt?: Date |null
}

import type { Ids } from "@/models/Ids";
import { Episode } from "@/models/Episode";
import { Type } from "class-transformer";

export class Season {
    // Extended: metadata (minimum data provided)
    number: number = 0;
    ids: Ids = {};

    //Extended: full
    title?: string;
    overview?: string;
    network?: string;
    rating?: number;
    votes?: number;
    episodeCount?: number;
    airedEpisodes?: number;

    @Type(() => Date)
    firstAired?: Date;

    @Type(() => Date)
    updatedAt?: Date;
    
    @Type(() => Episode)
    episodes: Episode[] = [];
}

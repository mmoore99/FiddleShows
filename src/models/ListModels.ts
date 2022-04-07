import type { User } from "@/models/UserModels";
import type { SyncGetWatchlistTypes } from "@/helpers/enums";
import type { Movie } from "@/models/MovieModels";
import type { Episode } from "@/models/EpisodeModels";
import type { Season } from "@/models/SeasonModels";
import type { Show } from "@/models/ShowModels";
import type { Person } from "@/models/PeopleModels";

export interface TraktList {
    name?: string;
    description?: string;
    privacy?: string;
    displayNumbers?: boolean;
    allowComments?: boolean;
    sortBy?: string;
    sortHow?: string;
    createdAt?: Date;
    updatedAt?: Date;
    itemCount?: number;
    commentCount?: number;
    likes?: number;
    ids?: TraktListIds;
    user?: User;
}

export interface TraktListIds {
    trakt?: number;
    slug?: string;
}

export interface TraktListItem {
    id: number;
    rank: number;
    listedAt: Date;
    notes?: string;
    type: SyncGetWatchlistTypes;
    movie?: Movie;
    episode?: Episode;
    season?: Season;
    show?: Show;
    person?: Person;
}

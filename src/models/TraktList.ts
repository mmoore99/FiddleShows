import type { TraktListIds } from "@/models/TraktListIds";
import type { User } from "@/models/User";

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

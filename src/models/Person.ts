import type { SocialIds } from "@/models/SocialIds";
import type {
    Ids
} from "@/models/Ids";

export interface Person {
    name: string;
    ids: Ids;

    biography?: string;
    birthday?: string;
    death?: string;
    birthplace?: string;
    homepage?: string;
    socialIds?: SocialIds;
}

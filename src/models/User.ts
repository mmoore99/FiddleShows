import type {
    Userids
} from "@/models/Userids";

export interface User {
    username?: string;
    private?: boolean;
    name?: string;
    vip?: boolean;
    vipEp?: boolean;
    ids?: Userids;
}

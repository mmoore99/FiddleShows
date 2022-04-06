import type {
    Ids
} from "@/models/CommonModels";

export interface Person {
    name:string
    ids: Ids
    
    biography?:string
    birthday?:string
    death?:string
    birthplace?:string
    homepage?:string
    socialIds?: SocialIds
}

export interface SocialIds {
    twitter?:string
    facebook?:string
    instagram?:string
    wikipedia?:string
}
import type { Ids } from "@/models/Ids";
import { Type } from "class-transformer";

export class Episode {
    season?: number;
    number: number = 0;
    title?: null | string;
    ids?: Ids;
    numberAbs?: null;
    overview?: null | string;
    rating?: number;
    votes?: number;
    commentCount?: number;
    @Type(() => Date)
    firstAired?: Date | null;
    @Type(() => Date)
    updatedAt?: Date;
    availableTranslations?: string[];
    runtime?: number;
}

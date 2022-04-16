// To parse this data:
//
//   import { Convert } from "./file";
//
//   const calendarShow = Convert.toCalendarShow(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import type { Airs } from "@/models/CommonModels";
import type { ShowWatchedProgress } from "@/models/ShowWatchedProgress";
import type { Show } from "@/models/Show";
import type { Season } from "@/models/Season";
import type { WatchListItem } from "@/models/WatchListItem";
import type { WatchedItem } from "@/models/WatchedItem";
import type { HistoryItem } from "@/models/HistoryItem";
import type { CalendarShow } from "@/models/CalendarShow";
import type { CalendarMovie } from "@/models/CalendarMovie";
import type { Episode } from "@/models/Episode";
import type { TraktListItem } from "@/models/TraktListItem";
import type { TraktList } from "@/models/TraktList";
import type { Ids } from "@/models/Ids";
import type { LastActivities } from "@/models/LastActivitiesModels";

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime

let typeMap: any = null;

export class JsonConvert {
    public static toCalendarShow(json: string): CalendarShow[] {
        typeMap = typeMapCalendarShows;
        return cast(JSON.parse(json), a(r("CalendarShow")));
    }

    public static toCalendarMovie(json: string): CalendarMovie[] {
        typeMap = typeMapMovieShows;
        return cast(JSON.parse(json), a(r("CalendarMovie")));
    }

    public static toHistoryItem(json: string): HistoryItem[] {
        typeMap = typeMapHistoryItem;
        return cast(JSON.parse(json), a(r("HistoryItem")));
    }

    public static toWatchedItem(json: string): WatchedItem[] {
        typeMap = typeMapWatchedItem;
        return cast(JSON.parse(json), a(r("WatchedItem")));
    }

    public static toWatchListItem(json: string): WatchListItem[] {
        typeMap = typeMapWatchListItem;
        return cast(JSON.parse(json), a(r("WatchListItem")));
    }

    public static toTraktList(json: string): TraktList[] {
        typeMap = typeMapTraktList;
        return cast(JSON.parse(json), a(r("TraktList")));
    }

    public static toTraktListItem(json: string): TraktListItem[] {
        typeMap = typeMapTraktListItem;
        return cast(JSON.parse(json), a(r("TraktListItem")));
    }

    public static toSeasons(json: string): Season[] {
        typeMap = typeMapSeasons;
        return cast(JSON.parse(json), a(r("Season")));
    }

    public static toEpisodes(json: string): Episode[] {
        typeMap = typeMapEpisodes;
        return cast(JSON.parse(json), a(r("Episode")));
        // return JSON.parse(json);
    }

    public static toShowWatchedProgress(json: string): ShowWatchedProgress {
        typeMap = typeMapShowWatchedProgress;
        return cast(JSON.parse(json), r("ShowWatchedProgress"));
    }

    public static toLastActivities(json: string): LastActivities {
        typeMap = typeMapLastActivities;
        return cast(JSON.parse(json), r("LastActivities"));
    }

    public static toLastActivitiesFromLocalStorage(json: string): LastActivities {
        console.log("json:", json);
        // debugger;
        typeMap = typeMapLastActivitiesLocalStorage;
        // return cast(JSON.parse(json), r("LastActivities"));

        const result = cast(JSON.parse(json), r("LastActivities")) as LastActivities;
        console.log("Result:", result);
        return result;
    }

    public static calendarShowToJson(value: CalendarShow[]): string {
        return JSON.stringify(uncast(value, a(r("CalendarShow"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach(
            (p: any) =>
                (map[p.json] = {
                    key: p.js,
                    typ: p.typ,
                })
        );
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach(
            (p: any) =>
                (map[p.js] = {
                    key: p.json,
                    typ: p.typ,
                })
        );
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map((el) => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach((key) => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = val[key];
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers")
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")
            ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")
            ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps, "");
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return {
        props,
        additional,
    };
}

function m(additional: any) {
    return {
        props: [],
        additional,
    };
}

function r(name: string) {
    return { ref: name };
}

const typeMapCalendarShows: any = {
    CalendarShow: o(
        [
            {
                json: "first_aired",
                js: "firstAired",
                typ: u(undefined, Date),
            },
            {
                json: "episode",
                js: "episode",
                typ: u(undefined, r("Episode")),
            },
            {
                json: "show",
                js: "show",
                typ: u(undefined, r("Show")),
            },
        ],
        false
    ),
    Episode: o(
        [
            {
                json: "season",
                js: "season",
                typ: u(undefined, 0),
            },
            {
                json: "number",
                js: "number",
                typ: u(undefined, 0),
            },
            {
                json: "title",
                js: "title",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "ids",
                js: "ids",
                typ: u(undefined, r("Ids")),
            },
            {
                json: "number_abs",
                js: "numberAbs",
                typ: u(undefined, null),
            },
            {
                json: "overview",
                js: "overview",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "rating",
                js: "rating",
                typ: u(undefined, 3.14),
            },
            {
                json: "votes",
                js: "votes",
                typ: u(undefined, 0),
            },
            {
                json: "comment_count",
                js: "commentCount",
                typ: u(undefined, 0),
            },
            {
                json: "first_aired",
                js: "firstAired",
                typ: u(undefined, Date),
            },
            {
                json: "updated_at",
                js: "updatedAt",
                typ: u(undefined, Date),
            },
            {
                json: "available_translations",
                js: "availableTranslations",
                typ: u(undefined, a("")),
            },
            {
                json: "runtime",
                js: "runtime",
                typ: u(undefined, 0),
            },
        ],
        false
    ),
    Ids: o(
        [
            {
                json: "trakt",
                js: "trakt",
                typ: u(undefined, 0),
            },
            {
                json: "tvdb",
                js: "tvdb",
                typ: u(undefined, u(0, null)),
            },
            {
                json: "imdb",
                js: "imdb",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "tmdb",
                js: "tmdb",
                typ: u(undefined, u(0, null)),
            },
            {
                json: "tvrage",
                js: "tvrage",
                typ: u(undefined, u(0, null)),
            },
            {
                json: "slug",
                js: "slug",
                typ: u(undefined, ""),
            },
        ],
        false
    ),
    Show: o(
        [
            {
                json: "title",
                js: "title",
                typ: u(undefined, ""),
            },
            {
                json: "year",
                js: "year",
                typ: u(undefined, 0),
            },
            {
                json: "ids",
                js: "ids",
                typ: u(undefined, r("Ids")),
            },
            {
                json: "overview",
                js: "overview",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "first_aired",
                js: "firstAired",
                typ: u(undefined, Date),
            },
            {
                json: "airs",
                js: "airs",
                typ: u(undefined, r("Airs")),
            },
            {
                json: "runtime",
                js: "runtime",
                typ: u(undefined, 0),
            },
            {
                json: "certification",
                js: "certification",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "network",
                js: "network",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "country",
                js: "country",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "trailer",
                js: "trailer",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "homepage",
                js: "homepage",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "status",
                js: "status",
                typ: u(undefined, ""),
            },
            {
                json: "rating",
                js: "rating",
                typ: u(undefined, 3.14),
            },
            {
                json: "votes",
                js: "votes",
                typ: u(undefined, 0),
            },
            {
                json: "comment_count",
                js: "commentCount",
                typ: u(undefined, 0),
            },
            {
                json: "updated_at",
                js: "updatedAt",
                typ: u(undefined, Date),
            },
            {
                json: "language",
                js: "language",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "available_translations",
                js: "availableTranslations",
                typ: u(undefined, a("")),
            },
            {
                json: "genres",
                js: "genres",
                typ: u(undefined, a("")),
            },
            {
                json: "aired_episodes",
                js: "airedEpisodes",
                typ: u(undefined, 0),
            },
        ],
        false
    ),
    Airs: o(
        [
            {
                json: "day",
                js: "day",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "time",
                js: "time",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "timezone",
                js: "timezone",
                typ: u(undefined, ""),
            },
        ],
        false
    ),
};

const typeMapMovieShows: any = {
    CalendarMovie: o(
        [
            {
                json: "released",
                js: "released",
                typ: u(undefined, Date),
            },
            {
                json: "movie",
                js: "movie",
                typ: u(undefined, r("Movie")),
            },
        ],
        false
    ),
    Movie: o(
        [
            {
                json: "title",
                js: "title",
                typ: u(undefined, ""),
            },
            {
                json: "year",
                js: "year",
                typ: u(undefined, u(0, null)),
            },
            {
                json: "ids",
                js: "ids",
                typ: u(undefined, r("Ids")),
            },
            {
                json: "tagline",
                js: "tagline",
                typ: u(undefined, ""),
            },
            {
                json: "overview",
                js: "overview",
                typ: u(undefined, ""),
            },
            {
                json: "released",
                js: "released",
                typ: u(undefined, Date),
            },
            {
                json: "runtime",
                js: "runtime",
                typ: u(undefined, 0),
            },
            {
                json: "country",
                js: "country",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "trailer",
                js: "trailer",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "homepage",
                js: "homepage",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "status",
                js: "status",
                typ: u(undefined, ""),
            },
            {
                json: "rating",
                js: "rating",
                typ: u(undefined, 3.14),
            },
            {
                json: "votes",
                js: "votes",
                typ: u(undefined, 0),
            },
            {
                json: "comment_count",
                js: "commentCount",
                typ: u(undefined, 0),
            },
            {
                json: "updated_at",
                js: "updatedAt",
                typ: u(undefined, Date),
            },
            {
                json: "language",
                js: "language",
                typ: u(undefined, ""),
            },
            {
                json: "available_translations",
                js: "availableTranslations",
                typ: u(undefined, a("")),
            },
            {
                json: "genres",
                js: "genres",
                typ: u(undefined, a("")),
            },
            {
                json: "certification",
                js: "certification",
                typ: u(undefined, u(null, "")),
            },
        ],
        false
    ),
    Ids: o(
        [
            {
                json: "trakt",
                js: "trakt",
                typ: u(undefined, 0),
            },
            {
                json: "slug",
                js: "slug",
                typ: u(undefined, ""),
            },
            {
                json: "imdb",
                js: "imdb",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "tmdb",
                js: "tmdb",
                typ: u(undefined, 0),
            },
        ],
        false
    ),
};

const typeMapHistoryItem: any = {
    HistoryItem: o(
        [
            {
                json: "id",
                js: "id",
                typ: u(undefined, 0),
            },
            {
                json: "watched_at",
                js: "watchedAt",
                typ: u(undefined, Date),
            },
            {
                json: "action",
                js: "action",
                typ: u(undefined, ""),
            },
            {
                json: "type",
                js: "type",
                typ: u(undefined, ""),
            },
            {
                json: "episode",
                js: "episode",
                typ: u(undefined, r("Episode")),
            },
            {
                json: "show",
                js: "show",
                typ: u(undefined, r("Show")),
            },
        ],
        false
    ),
    Episode: o(
        [
            {
                json: "season",
                js: "season",
                typ: u(undefined, 0),
            },
            {
                json: "number",
                js: "number",
                typ: u(undefined, 0),
            },
            {
                json: "title",
                js: "title",
                typ: u(undefined, ""),
            },
            {
                json: "ids",
                js: "ids",
                typ: u(undefined, r("Ids")),
            },
        ],
        false
    ),
    Ids: o(
        [
            {
                json: "trakt",
                js: "trakt",
                typ: u(undefined, 0),
            },
            {
                json: "tvdb",
                js: "tvdb",
                typ: u(undefined, u(0, null)),
            },
            {
                json: "imdb",
                js: "imdb",
                typ: u(undefined, u(null, "")),
            },
            {
                json: "tmdb",
                js: "tmdb",
                typ: u(undefined, 0),
            },
            {
                json: "tvrage",
                js: "tvrage",
                typ: u(undefined, u(0, null)),
            },
            {
                json: "slug",
                js: "slug",
                typ: u(undefined, ""),
            },
        ],
        false
    ),
    Show: o(
        [
            {
                json: "title",
                js: "title",
                typ: u(undefined, ""),
            },
            {
                json: "year",
                js: "year",
                typ: u(undefined, 0),
            },
            {
                json: "ids",
                js: "ids",
                typ: u(undefined, r("Ids")),
            },
        ],
        false
    ),
};

const typeMapWatchedItem: any = {
    WatchedItem: o(
        [
            { json: "plays", js: "plays", typ: u(undefined, 0) },
            { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, Date) },
            { json: "last_updated_at", js: "lastUpdatedAt", typ: u(undefined, Date) },
            { json: "reset_at", js: "resetAt", typ: u(undefined, null) },
            { json: "show", js: "show", typ: u(undefined, r("Show")) },
            { json: "seasons", js: "seasons", typ: u(undefined, a(r("WatchedSeason"))) },
        ],
        false
    ),
    WatchedSeason: o(
        [
            { json: "number", js: "number", typ: u(undefined, 0) },
            { json: "episodes", js: "episodes", typ: u(undefined, a(r("WatchedEpisode"))) },
        ],
        false
    ),
    WatchedEpisode: o(
        [
            { json: "number", js: "number", typ: u(undefined, 0) },
            { json: "plays", js: "plays", typ: u(undefined, 0) },
            { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, Date) },
        ],
        false
    ),
    Show: o(
        [
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "year", js: "year", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("Ids")) },
            { json: "overview", js: "overview", typ: u(undefined, "") },
            { json: "first_aired", js: "firstAired", typ: u(undefined, Date) },
            { json: "airs", js: "airs", typ: u(undefined, r("Airs")) },
            { json: "runtime", js: "runtime", typ: u(undefined, 0) },
            { json: "certification", js: "certification", typ: u(undefined, u(null, "")) },
            { json: "country", js: "country", typ: u(undefined, "") },
            { json: "trailer", js: "trailer", typ: u(undefined, u(null, "")) },
            { json: "homepage", js: "homepage", typ: u(undefined, u(null, "")) },
            { json: "status", js: "status", typ: u(undefined, "") },
            { json: "rating", js: "rating", typ: u(undefined, 3.14) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, 0) },
            { json: "network", js: "network", typ: u(undefined, "") },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "language", js: "language", typ: u(undefined, "") },
            { json: "available_translations", js: "availableTranslations", typ: u(undefined, a("")) },
            { json: "genres", js: "genres", typ: u(undefined, a("")) },
            { json: "aired_episodes", js: "airedEpisodes", typ: u(undefined, 0) },
        ],
        false
    ),
    Airs: o(
        [
            { json: "day", js: "day", typ: u(undefined, "") },
            { json: "time", js: "time", typ: u(undefined, "") },
            { json: "timezone", js: "timezone", typ: u(undefined, "") },
        ],
        false
    ),
    Ids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, 0) },
            { json: "slug", js: "slug", typ: u(undefined, "") },
            { json: "tvdb", js: "tvdb", typ: u(undefined, 0) },
            { json: "imdb", js: "imdb", typ: u(undefined, u(null, "")) },
            { json: "tmdb", js: "tmdb", typ: u(undefined, 0) },
            { json: "tvrage", js: "tvrage", typ: u(undefined, u(0, null)) },
        ],
        false
    ),
};

const typeMapWatchListItem: any = {
    WatchListItem: o(
        [
            { json: "rank", js: "rank", typ: u(undefined, 0) },
            { json: "id", js: "id", typ: u(undefined, 0) },
            { json: "listed_at", js: "listedAt", typ: u(undefined, Date) },
            { json: "notes", js: "notes", typ: u(undefined, null) },
            { json: "type", js: "type", typ: u(undefined, "") },
            { json: "show", js: "show", typ: u(undefined, r("Show")) },
            { json: "movie", js: "movie", typ: u(undefined, r("Movie")) },
            { json: "season", js: "season", typ: u(undefined, r("Season")) },
        ],
        false
    ),
    Movie: o(
        [
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "year", js: "year", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("Ids")) },
            { json: "tagline", js: "tagline", typ: u(undefined, "") },
            { json: "overview", js: "overview", typ: u(undefined, "") },
            { json: "released", js: "released", typ: u(undefined, Date) },
            { json: "runtime", js: "runtime", typ: u(undefined, 0) },
            { json: "country", js: "country", typ: u(undefined, "") },
            { json: "trailer", js: "trailer", typ: u(undefined, "") },
            { json: "homepage", js: "homepage", typ: u(undefined, u(null, "")) },
            { json: "status", js: "status", typ: u(undefined, "") },
            { json: "rating", js: "rating", typ: u(undefined, 3.14) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, 0) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "language", js: "language", typ: u(undefined, "") },
            { json: "available_translations", js: "availableTranslations", typ: u(undefined, a("")) },
            { json: "genres", js: "genres", typ: u(undefined, a("")) },
            { json: "certification", js: "certification", typ: u(undefined, "") },
        ],
        false
    ),
    Season: o(
        [
            { json: "number", js: "number", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, m(u(0, null))) },
            { json: "rating", js: "rating", typ: u(undefined, 3.14) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "episode_count", js: "episodeCount", typ: u(undefined, 0) },
            { json: "aired_episodes", js: "airedEpisodes", typ: u(undefined, 0) },
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "overview", js: "overview", typ: u(undefined, "") },
            { json: "first_aired", js: "firstAired", typ: u(undefined, Date) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "network", js: "network", typ: u(undefined, "") },
        ],
        false
    ),
    Show: o(
        [
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "year", js: "year", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("Ids")) },
            { json: "overview", js: "overview", typ: u(undefined, "") },
            { json: "first_aired", js: "firstAired", typ: u(undefined, Date) },
            { json: "airs", js: "airs", typ: u(undefined, r("Airs")) },
            { json: "runtime", js: "runtime", typ: u(undefined, 0) },
            { json: "certification", js: "certification", typ: u(undefined, u(null, "")) },
            { json: "country", js: "country", typ: u(undefined, "") },
            { json: "trailer", js: "trailer", typ: u(undefined, u(null, "")) },
            { json: "homepage", js: "homepage", typ: u(undefined, u(null, "")) },
            { json: "status", js: "status", typ: u(undefined, "") },
            { json: "rating", js: "rating", typ: u(undefined, 3.14) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, 0) },
            { json: "network", js: "network", typ: u(undefined, "") },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "language", js: "language", typ: u(undefined, "") },
            { json: "available_translations", js: "availableTranslations", typ: u(undefined, a("")) },
            { json: "genres", js: "genres", typ: u(undefined, a("")) },
            { json: "aired_episodes", js: "airedEpisodes", typ: u(undefined, 0) },
        ],
        false
    ),
    Airs: o(
        [
            { json: "day", js: "day", typ: u(undefined, "") },
            { json: "time", js: "time", typ: u(undefined, "") },
            { json: "timezone", js: "timezone", typ: u(undefined, "") },
        ],
        false
    ),
    Ids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, 0) },
            { json: "slug", js: "slug", typ: u(undefined, "") },
            { json: "tvdb", js: "tvdb", typ: u(undefined, 0) },
            { json: "imdb", js: "imdb", typ: u(undefined, "") },
            { json: "tmdb", js: "tmdb", typ: u(undefined, 0) },
            { json: "tvrage", js: "tvrage", typ: u(undefined, u(0, null)) },
        ],
        false
    ),
};

const typeMapShowWatchedProgress: any = {
    ShowWatchedProgress: o(
        [
            { json: "aired", js: "aired", typ: u(undefined, null, 0) },
            { json: "completed", js: "completed", typ: u(undefined, null, 0) },
            { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, null, Date) },
            { json: "reset_at", js: "resetAt", typ: u(undefined, null, Date) },
            { json: "seasons", js: "seasons", typ: u(undefined, a(r("ShowSeasonProgress"))) },
            { json: "hidden_seasons", js: "hiddenSeasons", typ: u(undefined, a("any")) },
            { json: "next_episode", js: "nextEpisode", typ: u(undefined, null, r("Episode")) },
            { json: "last_episode", js: "lastEpisode", typ: u(undefined, null, r("Episode")) },
        ],
        false
    ),
    Episode: o(
        [
            { json: "season", js: "season", typ: u(undefined, null, 0) },
            { json: "number", js: "number", typ: u(undefined, null, 0) },
            { json: "title", js: "title", typ: u(undefined, null, "") },
            { json: "ids", js: "ids", typ: u(undefined, null, r("Ids")) },
        ],
        false
    ),
    Ids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, null, 0) },
            { json: "tvdb", js: "tvdb", typ: u(undefined, null, 0) },
            { json: "imdb", js: "imdb", typ: u(undefined, null, "") },
            { json: "tmdb", js: "tmdb", typ: u(undefined, null, 0) },
            { json: "tvrage", js: "tvrage", typ: u(undefined, null, 0) },
        ],
        false
    ),
    ShowSeasonProgress: o(
        [
            { json: "number", js: "number", typ: u(undefined, null, 0) },
            { json: "title", js: "title", typ: u(undefined, null, "") },
            { json: "aired", js: "aired", typ: u(undefined, null, 0) },
            { json: "completed", js: "completed", typ: u(undefined, 0) },
            { json: "episodes", js: "episodes", typ: u(undefined, null, a(r("ShowEpisodeProgress"))) },
        ],
        false
    ),
    ShowEpisodeProgress: o(
        [
            { json: "number", js: "number", typ: u(undefined, 0) },
            { json: "completed", js: "completed", typ: u(undefined, true) },
            { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, null, Date) },
        ],
        false
    ),
};

const typeMapTraktList: any = {
    TraktList: o(
        [
            { json: "name", js: "name", typ: u(undefined, "") },
            { json: "description", js: "description", typ: u(undefined, "") },
            { json: "privacy", js: "privacy", typ: u(undefined, "") },
            { json: "display_numbers", js: "displayNumbers", typ: u(undefined, true) },
            { json: "allow_comments", js: "allowComments", typ: u(undefined, true) },
            { json: "sort_by", js: "sortBy", typ: u(undefined, "") },
            { json: "sort_how", js: "sortHow", typ: u(undefined, "") },
            { json: "created_at", js: "createdAt", typ: u(undefined, Date) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "item_count", js: "itemCount", typ: u(undefined, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, 0) },
            { json: "likes", js: "likes", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("TraktListids")) },
            { json: "user", js: "user", typ: u(undefined, r("User")) },
        ],
        false
    ),
    TraktListids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, 0) },
            { json: "slug", js: "slug", typ: u(undefined, "") },
        ],
        false
    ),
    User: o(
        [
            { json: "username", js: "username", typ: u(undefined, "") },
            { json: "private", js: "private", typ: u(undefined, true) },
            { json: "name", js: "name", typ: u(undefined, "") },
            { json: "vip", js: "vip", typ: u(undefined, true) },
            { json: "vip_ep", js: "vipEp", typ: u(undefined, true) },
            { json: "ids", js: "ids", typ: u(undefined, r("Userids")) },
        ],
        false
    ),
    Userids: o([{ json: "slug", js: "slug", typ: u(undefined, "") }], false),
};

const typeMapTraktListItem: any = {
    TraktListItem: o(
        [
            { json: "rank", js: "rank", typ: u(undefined, 0) },
            { json: "id", js: "id", typ: u(undefined, 0) },
            { json: "listed_at", js: "listedAt", typ: u(undefined, Date) },
            { json: "notes", js: "notes", typ: u(undefined, null) },
            { json: "type", js: "type", typ: u(undefined, "") },
            { json: "show", js: "show", typ: u(undefined, r("Show")) },
            { json: "movie", js: "movie", typ: u(undefined, r("Movie")) },
        ],
        false
    ),
    Movie: o(
        [
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "year", js: "year", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("Movieids")) },
            { json: "tagline", js: "tagline", typ: u(undefined, "") },
            { json: "overview", js: "overview", typ: u(undefined, "") },
            { json: "released", js: "released", typ: u(undefined, Date) },
            { json: "runtime", js: "runtime", typ: u(undefined, 0) },
            { json: "country", js: "country", typ: u(undefined, "") },
            { json: "trailer", js: "trailer", typ: u(undefined, "") },
            { json: "homepage", js: "homepage", typ: u(undefined, "") },
            { json: "status", js: "status", typ: u(undefined, "") },
            { json: "rating", js: "rating", typ: u(undefined, 3.14) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, 0) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "language", js: "language", typ: u(undefined, "") },
            { json: "available_translations", js: "availableTranslations", typ: u(undefined, a("")) },
            { json: "genres", js: "genres", typ: u(undefined, a("")) },
            { json: "certification", js: "certification", typ: u(undefined, "") },
        ],
        false
    ),
    Movieids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, 0) },
            { json: "slug", js: "slug", typ: u(undefined, "") },
            { json: "imdb", js: "imdb", typ: u(undefined, "") },
            { json: "tmdb", js: "tmdb", typ: u(undefined, 0) },
        ],
        false
    ),
    Show: o(
        [
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "year", js: "year", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("Showids")) },
            { json: "overview", js: "overview", typ: u(undefined, "") },
            { json: "first_aired", js: "firstAired", typ: u(undefined, Date) },
            { json: "airs", js: "airs", typ: u(undefined, r("Airs")) },
            { json: "runtime", js: "runtime", typ: u(undefined, 0) },
            { json: "certification", js: "certification", typ: u(undefined, u(null, "")) },
            { json: "country", js: "country", typ: u(undefined, "") },
            { json: "trailer", js: "trailer", typ: u(undefined, u(null, "")) },
            { json: "homepage", js: "homepage", typ: u(undefined, "") },
            { json: "status", js: "status", typ: u(undefined, "") },
            { json: "rating", js: "rating", typ: u(undefined, 3.14) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, 0) },
            { json: "network", js: "network", typ: u(undefined, "") },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "language", js: "language", typ: u(undefined, "") },
            { json: "available_translations", js: "availableTranslations", typ: u(undefined, a("")) },
            { json: "genres", js: "genres", typ: u(undefined, a("")) },
            { json: "aired_episodes", js: "airedEpisodes", typ: u(undefined, 0) },
        ],
        false
    ),
    Airs: o(
        [
            { json: "day", js: "day", typ: u(undefined, "") },
            { json: "time", js: "time", typ: u(undefined, "") },
            { json: "timezone", js: "timezone", typ: u(undefined, "") },
        ],
        false
    ),
    Showids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, 0) },
            { json: "slug", js: "slug", typ: u(undefined, "") },
            { json: "tvdb", js: "tvdb", typ: u(undefined, 0) },
            { json: "imdb", js: "imdb", typ: u(undefined, "") },
            { json: "tmdb", js: "tmdb", typ: u(undefined, 0) },
            { json: "tvrage", js: "tvrage", typ: u(undefined, u(0, null)) },
        ],
        false
    ),
};

const typeMapSeasons: any = {
    Season: o(
        [
            { json: "number", js: "number", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("Ids")) },
            { json: "rating", js: "rating", typ: u(undefined, 3.14) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "episode_count", js: "episodeCount", typ: u(undefined, 0) },
            { json: "aired_episodes", js: "airedEpisodes", typ: u(undefined, 0) },
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "overview", js: "overview", typ: u(undefined, "") },
            { json: "first_aired", js: "firstAired", typ: u(undefined, Date) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "network", js: "network", typ: u(undefined, "") },
            { json: "episodes", js: "episodes", typ: u(undefined, null, a(r("Episode"))) },
        ],
        false
    ),
    Episode: o(
        [
            { json: "season", js: "season", typ: u(undefined, 0) },
            { json: "number", js: "number", typ: u(undefined, 0) },
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "ids", js: "ids", typ: u(undefined, r("Ids")) },
            { json: "number_abs", js: "numberAbs", typ: u(undefined, u(0, null)) },
            { json: "overview", js: "overview", typ: u(undefined, null, "") },
            { json: "rating", js: "rating", typ: u(undefined, 0) },
            { json: "votes", js: "votes", typ: u(undefined, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, 0) },
            { json: "first_aired", js: "firstAired", typ: u(undefined, Date) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "available_translations", js: "availableTranslations", typ: u(undefined, a("")) },
            { json: "runtime", js: "runtime", typ: u(undefined, 0) },
        ],
        false
    ),
    Ids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, 0) },
            { json: "tvdb", js: "tvdb", typ: u(undefined, u(0, null)) },
            { json: "imdb", js: "imdb", typ: u(undefined, u(null, "")) },
            { json: "tmdb", js: "tmdb", typ: u(undefined, null, 0) },
            { json: "tvrage", js: "tvrage", typ: u(undefined, u(0, null)) },
        ],
        false
    ),
};

const typeMapEpisodes: any = {
    Episode: o(
        [
            { json: "season", js: "season", typ: u(undefined, null, 0) },
            { json: "number", js: "number", typ: u(undefined, null, 0) },
            { json: "title", js: "title", typ: u(undefined, null, "") },
            { json: "ids", js: "ids", typ: u(undefined, null, r("Ids")) },
            { json: "number_abs", js: "numberAbs", typ: u(undefined, null, 0) },
            { json: "overview", js: "overview", typ: u(undefined, null, "") },
            { json: "rating", js: "rating", typ: u(undefined, null, 0) },
            { json: "votes", js: "votes", typ: u(undefined, null, 0) },
            { json: "comment_count", js: "commentCount", typ: u(undefined, null, 0) },
            { json: "first_aired", js: "firstAired", typ: u(undefined, null, Date) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, null, Date) },
            { json: "available_translations", js: "availableTranslations", typ: u(undefined, null, a("")) },
            { json: "runtime", js: "runtime", typ: u(undefined, null, 0) },
        ],
        false
    ),
    Ids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, null, 0) },
            { json: "tvdb", js: "tvdb", typ: u(undefined, null, 0) },
            { json: "imdb", js: "imdb", typ: u(undefined, null, "") },
            { json: "tmdb", js: "tmdb", typ: u(undefined, null, 0) },
            { json: "tvrage", js: "tvrage", typ: u(undefined, null, 0) },
        ],
        false
    ),
};

const typeMapLastActivities: any = {
    LastActivities: o(
        [
            { json: "all", js: "all", typ: u(undefined, Date) },
            { json: "movies", js: "movies", typ: u(undefined, r("Movies")) },
            { json: "episodes", js: "episodes", typ: u(undefined, r("Episodes")) },
            { json: "shows", js: "shows", typ: u(undefined, r("Shows")) },
            { json: "seasons", js: "seasons", typ: u(undefined, r("Seasons")) },
            { json: "comments", js: "comments", typ: u(undefined, r("Comments")) },
            { json: "lists", js: "lists", typ: u(undefined, r("Lists")) },
            { json: "watchlist", js: "watchlist", typ: u(undefined, r("Recommendations")) },
            { json: "recommendations", js: "recommendations", typ: u(undefined, r("Recommendations")) },
            { json: "account", js: "account", typ: u(undefined, r("Account")) },
        ],
        false
    ),
    Account: o(
        [
            { json: "settings_at", js: "settingsAt", typ: u(undefined, Date) },
            { json: "followed_at", js: "followedAt", typ: u(undefined, Date) },
            { json: "following_at", js: "followingAt", typ: u(undefined, Date) },
            { json: "pending_at", js: "pendingAt", typ: u(undefined, Date) },
        ],
        false
    ),
    Comments: o(
        [
            { json: "liked_at", js: "likedAt", typ: u(undefined, Date) },
            { json: "blocked_at", js: "blockedAt", typ: u(undefined, Date) },
        ],
        false
    ),
    Episodes: o(
        [
            { json: "watched_at", js: "watchedAt", typ: u(undefined, Date) },
            { json: "collected_at", js: "collectedAt", typ: u(undefined, Date) },
            { json: "rated_at", js: "ratedAt", typ: u(undefined, Date) },
            { json: "watchlisted_at", js: "watchlistedAt", typ: u(undefined, Date) },
            { json: "commented_at", js: "commentedAt", typ: u(undefined, Date) },
            { json: "paused_at", js: "pausedAt", typ: u(undefined, Date) },
        ],
        false
    ),
    Lists: o(
        [
            { json: "liked_at", js: "likedAt", typ: u(undefined, Date) },
            { json: "updated_at", js: "updatedAt", typ: u(undefined, Date) },
            { json: "commented_at", js: "commentedAt", typ: u(undefined, Date) },
        ],
        false
    ),
    Movies: o(
        [
            { json: "watched_at", js: "watchedAt", typ: u(undefined, Date) },
            { json: "collected_at", js: "collectedAt", typ: u(undefined, Date) },
            { json: "rated_at", js: "ratedAt", typ: u(undefined, Date) },
            { json: "watchlisted_at", js: "watchlistedAt", typ: u(undefined, Date) },
            { json: "recommendations_at", js: "recommendationsAt", typ: u(undefined, Date) },
            { json: "commented_at", js: "commentedAt", typ: u(undefined, Date) },
            { json: "paused_at", js: "pausedAt", typ: u(undefined, Date) },
            { json: "hidden_at", js: "hiddenAt", typ: u(undefined, Date) },
        ],
        false
    ),
    Recommendations: o([{ json: "updated_at", js: "updatedAt", typ: u(undefined, Date) }], false),
    Seasons: o(
        [
            { json: "rated_at", js: "ratedAt", typ: u(undefined, Date) },
            { json: "watchlisted_at", js: "watchlistedAt", typ: u(undefined, Date) },
            { json: "commented_at", js: "commentedAt", typ: u(undefined, Date) },
            { json: "hidden_at", js: "hiddenAt", typ: u(undefined, Date) },
        ],
        false
    ),
    Shows: o(
        [
            { json: "rated_at", js: "ratedAt", typ: u(undefined, Date) },
            { json: "watchlisted_at", js: "watchlistedAt", typ: u(undefined, Date) },
            { json: "recommendations_at", js: "recommendationsAt", typ: u(undefined, Date) },
            { json: "commented_at", js: "commentedAt", typ: u(undefined, Date) },
            { json: "hidden_at", js: "hiddenAt", typ: u(undefined, Date) },
        ],
        false
    ),
};

const typeMapLastActivitiesLocalStorage: any = {
    "LastActivities": o([
        { json: "all", js: "all", typ: u(undefined, Date) },
        { json: "movies", js: "movies", typ: u(undefined, r("Movies")) },
        { json: "episodes", js: "episodes", typ: u(undefined, r("Episodes")) },
        { json: "shows", js: "shows", typ: u(undefined, r("Shows")) },
        { json: "seasons", js: "seasons", typ: u(undefined, r("Seasons")) },
        { json: "comments", js: "comments", typ: u(undefined, r("Comments")) },
        { json: "lists", js: "lists", typ: u(undefined, r("Lists")) },
        { json: "watchlist", js: "watchlist", typ: u(undefined, r("Recommendations")) },
        { json: "recommendations", js: "recommendations", typ: u(undefined, r("Recommendations")) },
        { json: "account", js: "account", typ: u(undefined, r("Account")) },
    ], false),
    "Account": o([
        { json: "settingsAt", js: "settingsAt", typ: u(undefined, Date) },
        { json: "followedAt", js: "followedAt", typ: u(undefined, Date) },
        { json: "followingAt", js: "followingAt", typ: u(undefined, Date) },
        { json: "pendingAt", js: "pendingAt", typ: u(undefined, Date) },
    ], false),
    "Comments": o([
        { json: "likedAt", js: "likedAt", typ: u(undefined, Date) },
        { json: "blockedAt", js: "blockedAt", typ: u(undefined, Date) },
    ], false),
    "Episodes": o([
        { json: "watchedAt", js: "watchedAt", typ: u(undefined, Date) },
        { json: "collectedAt", js: "collectedAt", typ: u(undefined, Date) },
        { json: "ratedAt", js: "ratedAt", typ: u(undefined, Date) },
        { json: "watchlistedAt", js: "watchlistedAt", typ: u(undefined, Date) },
        { json: "commentedAt", js: "commentedAt", typ: u(undefined, Date) },
        { json: "pausedAt", js: "pausedAt", typ: u(undefined, Date) },
    ], false),
    "Lists": o([
        { json: "likedAt", js: "likedAt", typ: u(undefined, Date) },
        { json: "updatedAt", js: "updatedAt", typ: u(undefined, Date) },
        { json: "commentedAt", js: "commentedAt", typ: u(undefined, Date) },
    ], false),
    "Movies": o([
        { json: "watchedAt", js: "watchedAt", typ: u(undefined, Date) },
        { json: "collectedAt", js: "collectedAt", typ: u(undefined, Date) },
        { json: "ratedAt", js: "ratedAt", typ: u(undefined, Date) },
        { json: "watchlistedAt", js: "watchlistedAt", typ: u(undefined, Date) },
        { json: "recommendationsAt", js: "recommendationsAt", typ: u(undefined, Date) },
        { json: "commentedAt", js: "commentedAt", typ: u(undefined, Date) },
        { json: "pausedAt", js: "pausedAt", typ: u(undefined, Date) },
        { json: "hiddenAt", js: "hiddenAt", typ: u(undefined, Date) },
    ], false),
    "Recommendations": o([
        { json: "updatedAt", js: "updatedAt", typ: u(undefined, Date) },
    ], false),
    "Seasons": o([
        { json: "ratedAt", js: "ratedAt", typ: u(undefined, Date) },
        { json: "watchlistedAt", js: "watchlistedAt", typ: u(undefined, Date) },
        { json: "commentedAt", js: "commentedAt", typ: u(undefined, Date) },
        { json: "hiddenAt", js: "hiddenAt", typ: u(undefined, Date) },
    ], false),
    "Shows": o([
        { json: "ratedAt", js: "ratedAt", typ: u(undefined, Date) },
        { json: "watchlistedAt", js: "watchlistedAt", typ: u(undefined, Date) },
        { json: "recommendationsAt", js: "recommendationsAt", typ: u(undefined, Date) },
        { json: "commentedAt", js: "commentedAt", typ: u(undefined, Date) },
        { json: "hiddenAt", js: "hiddenAt", typ: u(undefined, Date) },
    ], false),
};


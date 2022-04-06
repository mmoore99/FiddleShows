// To parse this data:
//
//   import { Convert, ShowWatchedProgress } from "./file";
//
//   const showWatchedProgress = Convert.toShowWatchedProgress(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ShowWatchedProgress {
    aired?:         number|null;
    completed?:     number|null;
    lastWatchedAt?: null;
    resetAt?:       null;
    seasons?:       Season[]|null;
    hiddenSeasons?: any[]|null;
    nextEpisode?:   NextEpisode |null;
    lastEpisode?:   NextEpisode | null;
}

export interface NextEpisode {
    season?: number|null;
    number?: number|null;
    title?:  string|null;
    ids?:    Ids|null;
}

export interface Ids {
    trakt?:  number;
    tvdb?:   number;
    imdb?:   string;
    tmdb?:   number;
    tvrage?: string |null;
}

export interface Season {
    number?:    number|null;
    title?:     string| null;
    aired?:     number|null;
    completed?: number|null;
    episodes?:  Episode[]|null;
}

export interface Episode {
    number?:        number|null;
    completed?:     boolean|null;
    lastWatchedAt?: Date| null;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ShowWatchedProgressSerializer {
    public static toShowWatchedProgress(json: string): ShowWatchedProgress {
        return cast(JSON.parse(json), r("ShowWatchedProgress"));
    }

    public static showWatchedProgressToJson(value: ShowWatchedProgress): string {
        return JSON.stringify(uncast(value, r("ShowWatchedProgress")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
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
        return val.map(el => transform(el, typ, getProps));
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
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
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
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
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
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ShowWatchedProgress": o([
        { json: "aired", js: "aired", typ: u(undefined, 0) },
        { json: "completed", js: "completed", typ: u(undefined, 0) },
        { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, null) },
        { json: "reset_at", js: "resetAt", typ: u(undefined, null) },
        { json: "seasons", js: "seasons", typ: u(undefined, a(r("ShowSeasonProgress"))) },
        { json: "hidden_seasons", js: "hiddenSeasons", typ: u(undefined, a("any")) },
        { json: "next_episode", js: "nextEpisode", typ: u(undefined, null, r("Episode")) },
        { json: "last_episode", js: "lastEpisode", typ: u(undefined, null, r("Episode")),},
    ], false),
    "Episode": o([
        { json: "season", js: "season", typ: u(undefined, null, 0) },
        { json: "number", js: "number", typ: u(undefined, null, 0) },
        { json: "title", js: "title", typ: u(undefined, null, "") },
        { json: "ids", js: "ids", typ: u(undefined, null, r("Ids")) },
    ], false),
    "Ids": o([
        { json: "trakt", js: "trakt", typ: u(undefined, null, 0) },
        { json: "tvdb", js: "tvdb", typ: u(undefined, null, 0) },
        { json: "imdb", js: "imdb", typ: u(undefined, null, "") },
        { json: "tmdb", js: "tmdb", typ: u(undefined, null, 0) },
        { json: "tvrage", js: "tvrage", typ: u(undefined, null) },
    ], false),
    "ShowSeasonProgress": o([
        { json: "number", js: "number", typ: u(undefined, null, 0) },
        { json: "title", js: "title", typ: u(undefined, null, "") },
        { json: "aired", js: "aired", typ: u(undefined, null, 0) },
        { json: "completed", js: "completed", typ: u(undefined, 0) },
        { json: "episodes", js: "episodes", typ: u(undefined, null, a(r("ShowEpisodeProgress"))) },
    ], false),
    "ShowEpisodeProgress": o([
        { json: "number", js: "number", typ: u(undefined, 0) },
        { json: "completed", js: "completed", typ: u(undefined, true) },
        { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, null) },
    ], false),
};

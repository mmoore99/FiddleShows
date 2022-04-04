// To parse this data:
//
//   import { Convert } from "./file";
//
//   const watchedItem = Convert.toWatchedItem(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import type {
    WatchedSeason
} from "@/models/SeasonModels";
import type {
    Show
} from "@/models/ShowModels";

export interface WatchedItem {
    plays?:         number;
    lastWatchedAt?: Date;
    lastUpdatedAt?: Date;
    resetAt?:       null;
    show?:          Show;
    seasons?:       WatchedSeason[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class WatchedItemSerializer {
    public static toWatchedItem(json: string): WatchedItem[] {
        return cast(JSON.parse(json), a(r("WatchedItem")));
    }

    public static watchedItemToJson(value: WatchedItem[]): string {
        return JSON.stringify(uncast(value, a(r("WatchedItem"))), null, 2);
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
    "WatchedItem": o([
        { json: "plays", js: "plays", typ: u(undefined, 0) },
        { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, Date) },
        { json: "last_updated_at", js: "lastUpdatedAt", typ: u(undefined, Date) },
        { json: "reset_at", js: "resetAt", typ: u(undefined, null) },
        { json: "show", js: "show", typ: u(undefined, r("Show")) },
        { json: "seasons", js: "seasons", typ: u(undefined, a(r("WatchedSeason"))) },
    ], false),
    "WatchedSeason": o([
        { json: "number", js: "number", typ: u(undefined, 0) },
        { json: "episodes", js: "episodes", typ: u(undefined, a(r("WatchedEpisode"))) },
    ], false),
    "WatchedEpisode": o([
        { json: "number", js: "number", typ: u(undefined, 0) },
        { json: "plays", js: "plays", typ: u(undefined, 0) },
        { json: "last_watched_at", js: "lastWatchedAt", typ: u(undefined, Date) },
    ], false),
    "Show": o([
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
    ], false),
    "Airs": o([
        { json: "day", js: "day", typ: u(undefined, "") },
        { json: "time", js: "time", typ: u(undefined, "") },
        { json: "timezone", js: "timezone", typ: u(undefined, "") },
    ], false),
    "Ids": o([
        { json: "trakt", js: "trakt", typ: u(undefined, 0) },
        { json: "slug", js: "slug", typ: u(undefined, "") },
        { json: "tvdb", js: "tvdb", typ: u(undefined, 0) },
        { json: "imdb", js: "imdb", typ: u(undefined, u(null, "")) },
        { json: "tmdb", js: "tmdb", typ: u(undefined, 0) },
        { json: "tvrage", js: "tvrage", typ: u(undefined, u(0, null)) },
    ], false),
};

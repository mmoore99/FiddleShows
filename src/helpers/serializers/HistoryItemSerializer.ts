// To parse this data:
//
//   import { Convert } from "./file";
//
//   const historyItem = Convert.toHistoryItem(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface HistoryItem {
    id?: number;
    watchedAt?: Date;
    action?: string;
    type?: string;
    episode?: Episode;
    show?: Show;
}

export interface Episode {
    season?: number;
    number?: number;
    title?: string;
    ids?: Ids;
}

export interface Ids {
    trakt?: number;
    tvdb?: number | null;
    imdb?: null | string;
    tmdb?: number;
    tvrage?: number | null;
    slug?: string;
}

export interface Show {
    title?: string;
    year?: number;
    ids?: Ids;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertHistoryItemJson {
    public static toHistoryItem(json: string): HistoryItem[] {
        return cast(JSON.parse(json), a(r("HistoryItem")));
    }

    public static historyItemToJson(value: HistoryItem[]): string {
        return JSON.stringify(uncast(value, a(r("HistoryItem"))), null, 2);
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
        typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
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
    HistoryItem: o(
        [
            { json: "id", js: "id", typ: u(undefined, 0) },
            { json: "watched_at", js: "watchedAt", typ: u(undefined, Date) },
            { json: "action", js: "action", typ: u(undefined, "") },
            { json: "type", js: "type", typ: u(undefined, "") },
            { json: "episode", js: "episode", typ: u(undefined, r("Episode")) },
            { json: "show", js: "show", typ: u(undefined, r("Show")) },
        ],
        false
    ),
    Episode: o(
        [
            { json: "season", js: "season", typ: u(undefined, 0) },
            { json: "number", js: "number", typ: u(undefined, 0) },
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "ids", js: "ids", typ: u(undefined, r("Ids")) },
        ],
        false
    ),
    Ids: o(
        [
            { json: "trakt", js: "trakt", typ: u(undefined, 0) },
            { json: "tvdb", js: "tvdb", typ: u(undefined, u(0, null)) },
            { json: "imdb", js: "imdb", typ: u(undefined, u(null, "")) },
            { json: "tmdb", js: "tmdb", typ: u(undefined, 0) },
            { json: "tvrage", js: "tvrage", typ: u(undefined, u(0, null)) },
            { json: "slug", js: "slug", typ: u(undefined, "") },
        ],
        false
    ),
    Show: o(
        [
            { json: "title", js: "title", typ: u(undefined, "") },
            { json: "year", js: "year", typ: u(undefined, 0) },
            { json: "ids", js: "ids", typ: u(undefined, r("Ids")) },
        ],
        false
    ),
};

export class RequestPagination {
    private _page: number;
    private _limit: number;

    constructor({ page = 1, limit = 10 }) {
        this._page = page;
        this._limit = limit;
    }

    toMap() {
        return {
            page: "$page",
            limit: "$limit",
        };
    }
}

export interface IFilters {
    [key: string]: any;
    query?: string;
    years?: string;
    runtime?: string;
    ratings?: string;
    genres?: string[];
    countries?: string[];
    languages?: string[];
}

interface IDictionary {
    [index: string]: string;
}

// alternative structure that also works
//export interface Filters extends IFilters {}
//export class Filters
export class Filters implements IFilters{
    [key: string]: any
    constructor(props: IFilters) {
        // create properties for each item in 'props'
        Object.assign(this, props);
    }

    toMap() {
        // any of the following 'index signatures' work
        // let map: IFilters = {};
        // let map = {} as IDictionary
        let map: IDictionary = {};
        // let map: { [key: string]: string } = {};

        for (const key in this) {
            const keyString = key.toString();
            const property = this[keyString];
            if (property != null) {
                if (Array.isArray(property)) map[keyString] = property.join(',')
                else map[keyString] = this[keyString];
            }
        }

        return map;
    }
}

export interface IMovieFilters{
    certifications?: string[];
}

export class MovieFilters extends Filters {
    certifications:string[] | undefined
    
    constructor(props: IFilters, movieFilters?:IMovieFilters) {
        super(props);
        this.certifications = movieFilters?.certifications;
    }
    
    toMap(){
        let map = super.toMap();
        if (this.certifications != null) {
            map["certifications"] = this.certifications.join(",");
        }
        return map;
    }
}

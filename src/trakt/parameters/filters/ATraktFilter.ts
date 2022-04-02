import type { IDictionary } from "@/models/CommonModels";
import { Range } from "@/models/CommonModels";

export abstract class ATraktFilter {
    public query: string | null = null;
    public years: Range<number> | null = null;
    public year: number | null = null;
    public runtimes: Range<number> | null = null;
    public ratings: Range<number> | null = null;
    public genres: string[] | null = null;
    public countries: string[] | null = null;
    public languages: string[] | null = null;

    withQuery(query: string) {
        if (!query) throw "query not valid";
        this.query = query;
        return this;
    }

    withYear(year: number) {
        if (year < 0 || year.toString().length != 4) throw "year not valid";
        this.year = year;
        this.years = null;
        return this;
    }

    withYears(startYear: number, endYear: number) {
        if (startYear < 0 || startYear.toString().length != 4) throw "startYear not valid";
        if (endYear < 0 || endYear.toString().length != 4) throw "endYear not valid";
        this.year = null;
        this.years = new Range<number>(startYear, endYear);
        return this;
    }

    withGenres(genres: string | string[]) {
        if (!Array.isArray(genres)) genres = genres.split(",");
        for (let i = 0; i < genres.length; i++) {
            genres[i] = genres[i].replace(" ", "");
        }
        this.genres = genres;
        return this;
    }

    withLanguages(languages: string | string[]) {
        if (!Array.isArray(languages)) languages = languages.split(",");
        for (let i = 0; i < languages.length; i++) {
            if (languages[i].length !== 2) throw "language not valid - must be two characters";
            languages[i] = languages[i].replace(" ", "");
        }
        this.languages = languages;
        return this;
    }

    withCountries(countries: string | string[]) {
        if (!Array.isArray(countries)) countries = countries.split(",");
        for (let i = 0; i < countries.length; i++) {
            countries[i] = countries[i].replace(" ", "");
        }
        this.countries = countries;
        return this;
    }

    withRuntimes(begin: number, end: number) {
        if (begin < 0 || end < 0 || end < begin) throw "runtimes not valid";
        this.runtimes = new Range<number>(begin, end);
        return this;
    }

    withRatings(begin: number, end: number) {
        if (begin < 0 || end < 0 || end < begin) throw "ratings not valid";
        this.ratings = new Range<number>(begin, end);
        return this;
    }

    hasValues() {
        return (
            this.hasQuerySet ||
            this.hasYearSet ||
            this.hasYearsSet ||
            this.hasGenresSet ||
            this.hasCountriesSet ||
            this.hasLanguagesSet ||
            this.hasRuntimesSet ||
            this.hasRatingsSet
        );
    }

    hasQuerySet() {
        return !!this.query;
    }

    hasYearSet() {
        return !!this.year && this.year.toString().length === 4;
    }

    hasYearsSet() {
        if (!!this.years) {
            const startYear = this.years.begin;
            const endYear = this.years.end;
            return startYear.toString().length == 4 && endYear.toString().length == 4;
        }
        return false;
    }

    hasGenresSet() {
        return !!this.genres;
    }

    hasCountriesSet() {
        return !!this.countries;
    }

    hasLanguagesSet() {
        return !!this.languages;
    }

    hasRuntimesSet() {
        if (!!this.runtimes) {
            return this.runtimes.begin > 0 && this.runtimes.end > this.runtimes.begin;
        }
        return false;
    }

    hasRatingsSet() {
        if (!!this.ratings) {
            return this.ratings.begin > 0 && this.ratings.end > this.ratings.begin;
        }
        return false;
    }

    // toMap = () => {
    //     let result: IDictionary = {};
    //
    //     if (!this.hasValues()) return result;
    //
    //     if (this.hasQuerySet()) result["query"] = this.query;
    //
    //     if (this.hasYearSet() && !this.hasYearsSet) {
    //         result["years"] = this.year;
    //     } else {
    //         if (!this.hasYearSet() && this.hasYearsSet) {
    //             const startYear = this.years?.begin;
    //             const endYear = this.years?.end;
    //             if (startYear! <= endYear!) result["years"] = `${startYear}-${endYear}`;
    //             else result["years"] = `${endYear}-${startYear}`;
    //         }
    //     }
    //
    //     if (this.hasGenresSet()) result["genres"] = this.genres!.join(",");
    //
    //     if (this.hasLanguagesSet()) result["languages"] = this.languages!.join(",");
    //
    //     if (this.hasCountriesSet()) result["countries"] = this.countries!.join(",");
    //
    //     if (this.hasRuntimesSet()) result["runtimes"] = `${this.runtimes!.begin}-${this.runtimes!.end}`;
    //
    //     if (this.hasRatingsSet()) result["ratings"] = `${this.ratings!.begin}-${this.ratings!.end}`;
    //
    //     return result;
    // };

    toMap() {
        let result: IDictionary = {};

        if (!this.hasValues()) return result;
        if (this.hasQuerySet()) result["query"] = this.query;

        if (this.hasYearSet() && !this.hasYearsSet()) {
            result["year"] = this.year;
        } else {
            if (!this.hasYearSet() && this.hasYearsSet()) {
                const startYear = this.years?.begin;
                const endYear = this.years?.end;
                if (startYear! <= endYear!) result["years"] = `${startYear}-${endYear}`;
                else result["years"] = `${endYear}-${startYear}`;
            }
        }

        if (this.hasGenresSet()) result["genres"] = this.genres!.join(",");

        if (this.hasLanguagesSet()) result["languages"] = this.languages!.join(",");

        if (this.hasCountriesSet()) result["countries"] = this.countries!.join(",");

        if (this.hasRuntimesSet()) result["runtimes"] = `${this.runtimes!.begin}-${this.runtimes!.end}`;

        if (this.hasRatingsSet()) result["ratings"] = `${this.ratings!.begin}-${this.ratings!.end}`;

        return result;
    }
}

export class TraktShowFilter extends ATraktFilter {
    public networks?: string[] | null;
    public status?: string[] | null;
    public certifications?: string[] | null;

    withNetworks(networks: string | string[]) {
        if (!Array.isArray(networks)) networks = networks.split(",");
        for (let i = 0; i < networks.length; i++) {
            networks[i] = networks[i].replace(" ", "");
        }
        this.networks = networks;
        return this;
    }

    withStatus(status: string | string[]) {
        if (!Array.isArray(status)) status = status.split(",");
        for (let i = 0; i < status.length; i++) {
            status[i] = status[i].replace(" ", "");
        }
        this.status = status;
        return this;
    }

    withCertifications(certifications: string | string[]) {
        if (!Array.isArray(certifications)) certifications = certifications.split(",");
        for (let i = 0; i < certifications.length; i++) {
            certifications[i] = certifications[i].replace(" ", "");
        }
        this.certifications = certifications;
        return this;
    }

    hasValues() {
        return super.hasValues() || this.hasNetworksSet || this.hasStatusSet || this.hasCertificationsSet;
    }

    hasNetworksSet() {
        return !!this.networks && this.networks.length > 0;
    }

    hasStatusSet() {
        return !!this.status && this.status.length > 0;
    }

    hasCertificationsSet() {
        return !!this.certifications && this.certifications.length > 0;
    }

    toMap() {
        let result = super.toMap();

        if (!this.hasValues()) return result;

        if (this.hasNetworksSet()) result["networks"] = this.networks!.join(",");

        if (this.hasCertificationsSet()) result["certifications"] = this.certifications!.join(",");

        if (this.hasStatusSet()) result["status"] = this.status!.join(",");

        return result;
    }
}

export class TraktMovieFilter extends ATraktFilter {
    public certifications?: string[] | null;

    withCertifications(certifications: string | string[]) {
        if (!Array.isArray(certifications)) certifications = certifications.split(",");
        for (let i = 0; i < certifications.length; i++) {
            certifications[i] = certifications[i].replace(" ", "");
        }
        this.certifications = certifications;
        return this;
    }

    hasValues() {
        return super.hasValues() || this.hasCertificationsSet;
    }

    hasCertificationsSet() {
        return !!this.certifications && this.certifications.length > 0;
    }

    toMap() {
        let result = super.toMap();

        if (!this.hasValues()) return result;

        if (this.hasCertificationsSet()) result["certifications"] = this.certifications!.join(",");

        return result;
    }
}

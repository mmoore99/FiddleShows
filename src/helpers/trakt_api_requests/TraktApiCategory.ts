import type { TraktClient } from "@/trakt/TraktClient";

export default abstract class TraktApiCategory {
    protected _traktClient: TraktClient;

    protected constructor(traktClient: TraktClient) {
        this._traktClient = traktClient;
    }
}

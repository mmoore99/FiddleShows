import { useProgramStore } from "@/stores/ProgramStore";
import type { ShowContext } from "@/models/ShowContext";
import type { LastActivities } from "@/models/LastActivitiesModels";

export class LocalStorageService {
    private _programStore;
    private _localStorage;

    constructor() {
        this._programStore = useProgramStore();
        this._localStorage = this._programStore.localStorage;
    }

    async getShowContexts() {
        return await this._localStorage!.get(this._programStore.localStorageKeys.showContexts);
    }

    async setShowContexts(storeContexts: ShowContext[]) {
        return await this._localStorage!.set(this._programStore.localStorageKeys.showContexts, storeContexts);
    }

    async getLastActivities() {
        return await this._localStorage!.get(this._programStore.localStorageKeys.lastActivities);
    }

    async setLastActivities(lastActivities: LastActivities) {
        return await this._localStorage!.set(this._programStore.localStorageKeys.lastActivities, lastActivities);
    }
}

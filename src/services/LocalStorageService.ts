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
        const jsonString = await this._localStorage!.get(this._programStore.localStorageKeys.showContexts) 
        return jsonString ? JSON.parse(jsonString) : null;
    }

    async setShowContexts(storeContexts: ShowContext[]) {
        return await this._localStorage!.set(this._programStore.localStorageKeys.showContexts, JSON.stringify(storeContexts));
    }

    async getLastActivities() {
        return await this._localStorage!.get(this._programStore.localStorageKeys.lastActivities);
    }

    async setLastActivities(lastActivities: LastActivities) {
        return await this._localStorage!.set(this._programStore.localStorageKeys.lastActivities, lastActivities);
    }
}

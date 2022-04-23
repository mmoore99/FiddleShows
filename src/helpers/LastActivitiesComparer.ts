import type {
    LastActivities
} from "@/models/LastActivitiesModels";
import {
    isDateObject
} from "@/helpers/Utils";

export class LastActivitiesComparer {
    private readonly _oldLastActivities: LastActivities;
    private readonly _newLastActivities: LastActivities;

    constructor(oldLastActivities: LastActivities, newLastActivities: LastActivities) {
        this._oldLastActivities = oldLastActivities;
        this._newLastActivities = newLastActivities;
    }
    
    compare(){
        let result:any = [];
        if (!this._oldLastActivities){
            console.log(`oldLastActivities=${this._oldLastActivities}`);
            return [".all"];
        }
        if (this._oldLastActivities.all?.toISOString() === this._newLastActivities.all?.toISOString()) {
            console.log("'All' values are the same, no refresh needed");
            return result;
        }
        return this.iterate(this._oldLastActivities, this._newLastActivities);
    }

    private iterate(oldObj: any, newObj: any, objectName: string = "") {
        let result:any = [];
        let dateName = "";
        Object.entries(oldObj).forEach(([key, value]) => {
            if (typeof oldObj[key] === "object" && oldObj[key] !== null && !isDateObject(oldObj[key])) {
                this.iterate(oldObj[key], newObj[key], key).forEach((x:string) => result.push(x));
                return
            }
            if (!key) return;
            dateName = key;
            const oldDate = oldObj[key].toISOString()
            const newDate = newObj[key].toISOString()
            if (oldDate !== newDate){
                console.log(`${objectName}.${dateName}: old=${oldDate}, new=${newDate}`);
                result.push(`${objectName}.${dateName}`)
            }
        });
        return result;
    }
}
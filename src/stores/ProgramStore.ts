import { defineStore, acceptHMRUpdate } from "pinia";
import type  { TraktClient } from "@/trakt/TraktClient";

// import { useLocalStorage } from "@vueuse/core";

export const useProgramStore = defineStore("ProgramStore", {
    state: () => {
        return {
            traktClient: null as TraktClient|null,
        };
    },
    getters: {
        // count: (state) => state.items.length,
        // isEmpty: (state) => state.count === 0,
    },
    actions: {
        // addItems(count, item) {
        //     count = parseInt(count);
        //     for (let index = 0; index < count; index++) {
        //         this.items.push({ ...item });
        //     }
        // },
        // clearItem(itemName) {
        //     this.items = this.items.filter((item) => item.name !== itemName);
        // },
        // setItemCount(item, count) {
        //     this.clearItem(item.name);
        //     this.addItems(count, item);
        // },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProgramStore, import.meta.hot));
}

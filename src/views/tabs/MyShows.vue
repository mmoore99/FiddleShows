<script setup lang="ts">
    interface GroupDisplayStatuses {
        isDisplayGroup1: boolean;
        isDisplayGroup2: boolean;
        isDisplayGroup3: boolean;
        isDisplayGroup4: boolean;
    }

    import { ref, reactive, onMounted, computed, toRaw } from "vue";
    import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItemDivider, IonIcon, IonLabel } from "@ionic/vue";
    import { chevronUp, chevronDown, filterCircleOutline, calendar, personCircle, tv, timerOutline, search, list, funnel, heart } from "ionicons/icons";
    import { useRouter, useRoute } from "vue-router";
    import { useProgramStore } from "@/stores/ProgramStore";
    import { useShowStore } from "@/stores/ShowStore";
    import { ShowsService } from "@/services/ShowsService";
    import type { TraktClient } from "@/trakt/TraktClient";
    import { ShowContext } from "@/models/ShowContext";
    import { useLocalStorage } from "@vueuse/core";
    import MyShowsItem from "@/components/MyShowsItem.vue";
    import { plainToInstance, Type } from "class-transformer";
    import type { Storage } from "@ionic/storage";
    import { LastActivitiesComparer } from "@/helpers/LastActivitiesComparer";

    console.log("in MyShows.vue");
    
    const _programStore = useProgramStore();
    const _showStore = useShowStore();
    const _traktClient = _programStore.traktClient as TraktClient;
    const _localStorage = _programStore.localStorage as Storage;
    const _showsService = new ShowsService(_traktClient);
    const router = useRouter();
    const route = useRoute();

    const showsListRef = ref<HTMLIonListElement|null>(null);

    let showContexts = ref<ShowContext[]>([]);
    const groupDisplayStatuses = reactive<GroupDisplayStatuses> ({
        isDisplayGroup1: true,
        isDisplayGroup2: true,
        isDisplayGroup3: true,
        isDisplayGroup4: true,
    });
    
    onMounted(async () => {
        console.log("in MyShows.vue onMounted");
        const savedGroupDisplayStatuses = (await _localStorage.get(_programStore.localStorageKeys.groupDisplayStatuses)) as GroupDisplayStatuses;
        if (savedGroupDisplayStatuses) {
            Object.assign(groupDisplayStatuses, savedGroupDisplayStatuses);
        }
    });

    const toggleDisplayGroup = (group: number) => {
        switch (group) {
            case 1:
                groupDisplayStatuses.isDisplayGroup1 = !groupDisplayStatuses.isDisplayGroup1;
                break;
            case 2:
                groupDisplayStatuses.isDisplayGroup2 = !groupDisplayStatuses.isDisplayGroup2;
                break;
            case 3:
                groupDisplayStatuses.isDisplayGroup3 = !groupDisplayStatuses.isDisplayGroup3;
                break;
            case 4:
                groupDisplayStatuses.isDisplayGroup4 = !groupDisplayStatuses.isDisplayGroup4;
                break;
        }
        saveGroupDisplayStatuses();
    };

    const loadData = async () => {
        try {
            console.log("in MyShows.vue loadData");
            
            const savedShowContexts = ref<ShowContext[]>([]);
            savedShowContexts.value = await _localStorage.get(_programStore.localStorageKeys.showContexts);
            if (savedShowContexts.value && savedShowContexts.value.length > 0) {
                console.log("Loading show contexts from local storage");
                showContexts.value = plainToInstance<ShowContext, any>(ShowContext, savedShowContexts.value);
            }

            if (await hasDataBeenUpdated()) {
                console.log("Loading show contexts from trakt api");
                showContexts.value = await _showsService.getShowContextsForSelectedSources(_showStore.myShowsOptions);
                _localStorage.set(_programStore.localStorageKeys.showContexts, toRaw(showContexts.value)).then();
            }
            //console.log("localShowContexts after loadData: ", localShowContexts.value);

            _showStore.showContexts = showContexts.value;
            console.log("ShowContexts:", showContexts.value);
            console.log("Finished - MyShows.vue loadData");
        } catch (e) {
            // Deal with the fact the chain failed
        }
        // `text` is not available here
    };
    loadData();

    const hasDataBeenUpdated = async () => {
        const savedLastActivities = await _localStorage.get(_programStore.localStorageKeys.lastActivities);
        console.log(`savedLastActivities=`, savedLastActivities);
        const currentLastActivitiesResult = await _traktClient.Sync.getLastActivities();
        const currentLastActivities = currentLastActivitiesResult.content;
        console.log(`currentLastActivities=`, currentLastActivities);

        const compareResult = new LastActivitiesComparer(savedLastActivities, currentLastActivities!).compare();
        console.log(`compareResult=${compareResult}`);
        const result = compareResult.length > 0;
        console.log(`isRefresh=${result}`);

        await _localStorage.set(_programStore.localStorageKeys.lastActivities, currentLastActivities);
        return result;
    };

    const onShowItemSwiped = () => {
        debugger;
        // according to docs the command below with $el should be required, but for some reason here it is not
        // showsListRef!.value!.$el.closeSlidingItems()
        showsListRef!.value!.closeSlidingItems()
    };

    const saveGroupDisplayStatuses = () => {
        _localStorage.set(_programStore.localStorageKeys.groupDisplayStatuses, toRaw(groupDisplayStatuses)).then();
    };

    const showsWatchingEpisodesAvailable = computed(() => {
        return showContexts.value.filter((showContext) => showContext.isSomeWatched());
    });

    const caughtUpNewEpisodesScheduled = computed(() => {
        return showContexts.value.filter((showContext) => showContext.isAllWatched() && showContext!.progress!.nextEpisode !== null);
    });

    const caughtUpNoNewEpisodesScheduled = computed(() => {
        return showContexts.value.filter((showContext) => showContext.isAllWatched() && showContext!.progress!.nextEpisode === null);
    });

    const showsNotStartedWatching = computed(() => {
        return showContexts.value.filter((showContext) => showContext.isNoneWatched());
    });
    
    console.log("Finished - MyShows.vue");
</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar mode ="ios">
                <ion-buttons slot="start">
                    <ion-button>
                        <ion-menu-button auto-hide="false"></ion-menu-button>
                    </ion-button>
                </ion-buttons>
                <ion-segment value="episodes">
                    <ion-segment-button value="episodes">Episodes</ion-segment-button>
                    <ion-segment-button value="movies">Movies</ion-segment-button>
                </ion-segment>
                <ion-buttons slot="end">
                    <ion-button>
                        <ion-icon :icon="filterCircleOutline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
            
        </ion-header>

        <ion-content :fullscreen="true">
            <div id="container">
                <ion-list style="padding-top: 0" ref="showsListRef">
                    <ion-item-divider sticky>
                        <ion-label> In Progress, New Episodes Available ({{ showsWatchingEpisodesAvailable.length }}) </ion-label>
                        <ion-icon class="chevron" slot="end" :icon="chevronDown" v-show="groupDisplayStatuses.isDisplayGroup1" @click="toggleDisplayGroup(1)"></ion-icon>
                        <ion-icon class="chevron" slot="end" :icon="chevronUp" v-show="!groupDisplayStatuses.isDisplayGroup1" @click="toggleDisplayGroup(1)"></ion-icon>
                    </ion-item-divider>
                    <MyShowsItem v-show="groupDisplayStatuses.isDisplayGroup1" v-for="showContext in showsWatchingEpisodesAvailable" :show-context="showContext" @show-item-swiped="onShowItemSwiped"></MyShowsItem>

                    <ion-item-divider sticky>
                        <ion-label> Caught Up, New Episodes Scheduled ({{ caughtUpNewEpisodesScheduled.length }}) </ion-label>
                        <ion-icon class="chevron" slot="end" :icon="chevronDown" v-show="groupDisplayStatuses.isDisplayGroup2" @click="toggleDisplayGroup(2)"></ion-icon>
                        <ion-icon class="chevron" slot="end" :icon="chevronUp" v-show="!groupDisplayStatuses.isDisplayGroup2" @click="toggleDisplayGroup(2)"></ion-icon>
                    </ion-item-divider>
                    <MyShowsItem v-show="groupDisplayStatuses.isDisplayGroup2" v-for="showContext in caughtUpNewEpisodesScheduled" :show-context="showContext"></MyShowsItem>

                    <ion-item-divider sticky>
                        <ion-label> Caught Up, No New Episodes Scheduled ({{ caughtUpNoNewEpisodesScheduled.length }}) </ion-label>
                        <ion-icon class="chevron" slot="end" :icon="chevronDown" v-show="groupDisplayStatuses.isDisplayGroup3" @click="toggleDisplayGroup(3)"></ion-icon>
                        <ion-icon class="chevron" slot="end" :icon="chevronUp" v-show="!groupDisplayStatuses.isDisplayGroup3" @click="toggleDisplayGroup(3)"></ion-icon>
                    </ion-item-divider>
                    <MyShowsItem v-show="groupDisplayStatuses.isDisplayGroup3" v-for="showContext in caughtUpNoNewEpisodesScheduled" :show-context="showContext"></MyShowsItem>

                    <ion-item-divider sticky>
                        <ion-label> Not Started Watching ({{ showsNotStartedWatching.length }}) </ion-label>
                        <ion-icon class="chevron" slot="end" :icon="chevronDown" v-show="groupDisplayStatuses.isDisplayGroup4" @click="toggleDisplayGroup(4)"></ion-icon>
                        <ion-icon class="chevron" slot="end" :icon="chevronUp" v-show="!groupDisplayStatuses.isDisplayGroup4" @click="toggleDisplayGroup(4)"></ion-icon>
                    </ion-item-divider>
                    <MyShowsItem v-show="groupDisplayStatuses.isDisplayGroup4" v-for="showContext in showsNotStartedWatching" :show-context="showContext"></MyShowsItem>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
    ion-item-divider {
        background-color: #9e6d6d;
        color: white;
        font-weight: 600;
        height: 31px;
    }

    .chevron {
        color: white;
        margin-right: 10px;
    }
    /*#container {*/
    /*    text-align: center;*/
    /*    position: absolute;*/
    /*    left: 0;*/
    /*    right: 0;*/
    /*    top: 50%;*/
    /*    transform: translateY(-50%);*/
    /*}*/

    /*#container strong {*/
    /*    font-size: 20px;*/
    /*    line-height: 26px;*/
    /*}*/

    /*#container p {*/
    /*    font-size: 16px;*/
    /*    line-height: 22px;*/
    /*    color: #8c8c8c;*/
    /*    margin: 0;*/
    /*}*/

    /*#container a {*/
    /*    text-decoration: none;*/
    /*}*/
</style>

// Optional approaches to allow using async.await in top level of Vue component with script setup
// Other alternative is to use in onMounted lifecycle hook
// showsService.getShowContextsForSelectedSources(showStore.myShowsOptions).then(
//     (result) => {
//         showContexts.value = result;
//     },
//     (error) => {
//         console.log(error);
//     }
// );

// (async () => {
//     try {
//         showContexts.value = await showsService.getShowContextsForSelectedSources(showStore.myShowsOptions);
//     } catch (e) {
//         // Deal with the fact the chain failed
//     }
//     // `text` is not available here
// })();
<script setup lang="ts">
    import { IonApp, IonGrid, IonRow, IonCol, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane } from "@ionic/vue";

    import {
        archiveOutline,
        archiveSharp,
        bookmarkOutline,
        bookmarkSharp,
        heartOutline,
        heartSharp,
        mailOutline,
        mailSharp,
        paperPlaneOutline,
        paperPlaneSharp,
        trashOutline,
        trashSharp,
        warningOutline,
        warningSharp,
    } from "ionicons/icons";

    import { computed, defineComponent, onMounted, provide, ref, toRaw } from "vue";

    import { useRouter, useRoute } from "vue-router";
    import type { TraktClient } from "@/trakt/TraktClient";
    import { RequestPagination } from "@/models/RequestModels";
    import { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
    import { ShowMovieType } from "@/helpers/enums";
    import { TraktApiTests } from "@/tests/TraktApiTests";
    import { useProgramStore } from "@/stores/ProgramStore";
    import { useShowStore } from "@/stores/ShowStore";
    import { MyShowsOptions } from "@/models/MyShowsOptions";
    import type { Show } from "@/models/Show";
    import type { WatchListItem } from "@/models/WatchListItem";
    import type { WatchedItem } from "@/models/WatchedItem";
    import type { HistoryItem } from "@/models/HistoryItem";
    import type { CalendarShow } from "@/models/CalendarShow";
    import type { CalendarMovie } from "@/models/CalendarMovie";
    import type { Movie } from "@/models/Movie";
    import type { TraktListItem } from "@/models/TraktListItem";
    import type { TraktList } from "@/models/TraktList";
    import { useLocalStorage } from "@vueuse/core";
    import type { Storage } from "@ionic/storage";
    import type { ShowContext } from "@/models/ShowContext";
    import type { LastActivities } from "@/models/LastActivitiesModels";
    import { LastActivitiesComparer } from "@/helpers/LastActivitiesComparer";
    import { plainToInstance } from "class-transformer";
    import { JsonConvert } from "@/helpers/serializers/JsonConvert";

    const programStore = useProgramStore();
    const showStore = useShowStore();

    const router = useRouter();
    const route = useRoute();

    const selectedIndex = ref(0);
    const appPages = [
        {
            title: "Tabs",
            url: "/tabs",
        },
        {
            title: "Other",
            url: "/other",
        },
    ];
    console.log("in App.vue");

    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
        selectedIndex.value = appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
    }

    const screenWidth = ref(window.innerWidth);

    onMounted(async () => {
        console.log("in App.vue onMounted");
        window.onresize = () => {
            screenWidth.value = window.innerWidth;
            console.log(`screenWidth=${screenWidth.value}`);
            console.log(`isWideScreen=${isWideScreen.value}`);
        };

        // alternative approach to get around problem of using async in setup without using Suspense
        // see https://stackoverflow.com/questions/64117116/how-can-i-use-async-await-in-the-vue-3-0-setup-function-using-typescript
        // const apiResult = await _apiSession.Calendar.getMyCalendarShows();
        // console.log(apiResult);
    });

    const isWideScreen = computed(() => {
        return screenWidth.value >= 768;
    });

    const tabsColSize = computed(() => {
        return isWideScreen.value ? 6.3 : 12;
    });

    provide("isWideScreen", isWideScreen);
    provide("screenWidth", screenWidth);

    const _traktClient = programStore.traktClient as TraktClient;
    const _localStorage = programStore.localStorage as Storage;

    const loadData = async () => {
        try {
            console.log("in App.vue loadData");
            // const savedLastActivities = await _localStorage.get(programStore.localStorageKeys.lastActivities);
            // console.log(`savedLastActivities=`, savedLastActivities);
            // const currentLastActivitiesResult = await _traktClient.Sync.getLastActivities();
            // const currentLastActivities = currentLastActivitiesResult.content;
            //
            // const compareResult = new LastActivitiesComparer(savedLastActivities, currentLastActivities!).compare();
            // console.log(`compareResult=${compareResult}`);
            // const isRefresh = compareResult.length > 0;
            // console.log(`isRefresh=${isRefresh}`);
            // await _localStorage.set(programStore.localStorageKeys.lastActivities, currentLastActivities);
            console.log("Finished - App.vue loadData");
        } catch (e) {
            // Deal with the fact the chain failed
        }
        // `text` is not available here
    };

    // const isRefreshNeeded = (savedLastActivities: LastActivities, currentLastActivities:LastActivities) => {
    //     let result = false;
    //         if (!savedLastActivities){
    //             console.log(`savedLastActivities=${savedLastActivities}`);
    //             result = true
    //         }else {
    //             console.log(`savedLastActivities.all=${savedLastActivities!.all}currentLastActivities.all=${currentLastActivities!.all}`);
    //             if (savedLastActivities.all?.toISOString() === currentLastActivities.all?.toISOString()) {
    //                 console.log("'All' values are the same, no refresh needed");
    //                 return false;
    //             }
    //
    //             const compareResult = new LastActivitiesComparer(savedLastActivities, currentLastActivities!).compare()
    //             console.log(`compareResult=${compareResult}`);
    //             return compareResult.length > 0;
    //         }
    // };
    loadData();


    // new TraktApiTests(_traktClient).execute();
    console.log(`screenWidth=${screenWidth.value}`);
    console.log(`isWideScreen=${isWideScreen.value}`);
    console.log("Finished - App.vue");
</script>

<template>
    <ion-app>
        <ion-content>
            <ion-grid style="height: 100vh" class="ion-no-padding">
                <ion-row style="height: 100vh">
                    <ion-col v-if="isWideScreen" class="col-1 side-column" size="2.5">
                        <div style="height: 100%; background-color: red">
                            <!-- <h1>1 of 3</h1> -->
                            <ion-list id="inbox-list">
                                <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
                                    <ion-item
                                        @click="selectedIndex = i"
                                        router-direction="root"
                                        :router-link="p.url"
                                        lines="none"
                                        detail="false"
                                        class="hydrated"
                                        :class="{
                                            selected: selectedIndex === i,
                                        }"
                                        style="cursor: pointer"
                                    >
                                        <ion-label>
                                            {{ p.title }}
                                        </ion-label>
                                    </ion-item>
                                </ion-menu-toggle>
                            </ion-list>
                        </div>
                    </ion-col>
                    <ion-col class="col-2" :size="tabsColSize">
                        <div style="height: 100%; background-color: blue">
                            <!-- <h1>2 of 3</h1> -->
                            <ion-router-outlet id="main-content"></ion-router-outlet>
                        </div>
                    </ion-col>
                    <ion-col v-if="isWideScreen" class="col-3 side-column">
                        <div style="height: 100%; background-color: green">
                            <!-- <h1>3 of 3</h1> -->
                        </div>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-app>
</template>

<style>
    .test-class {
        flex: unset;
        width: 600px;
        background-color: red;
    }

    .only-on-wide-screen {
        display: none;
    }

    @media screen and (min-width: 768px) {
        .only-on-wide-screen {
            display: unset;
        }
    }
</style>

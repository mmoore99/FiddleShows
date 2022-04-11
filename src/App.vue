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

    import { computed, defineComponent, onMounted, provide, ref } from "vue";

    import { useRouter, useRoute } from "vue-router";
    import { TraktClient } from "@/trakt/TraktClient";
    import { RequestPagination } from "@/models/RequestModels";
    import type { CalendarMovie, CalendarShow } from "@/models/CalendarModels";
    import { TraktShowFilter } from "@/trakt/parameters/filters/TraktFilters";
    import type { HistoryItem, WatchedItem, WatchListItem } from "@/models/UserModels";
    import { ShowMovieType } from "@/helpers/enums";
    import type { Movie } from "@/models/MovieModels";
    import type { Show } from "@/models/ShowModels";
    import type { TraktList, TraktListItem } from "@/models/ListModels";
    import { TraktApiTests } from "@/tests/TraktApiTests";
    import { useProgramStore } from "@/stores/ProgramStore";

    const PROXY_URL = "https://fierce-castle-85156.herokuapp.com/";
    const CLIENT_ID = "f3939aa847cf9df9eb698298ec01c499bd0b8b0d76c0a1920a6e4c04e3130c39";
    const CLIENT_SECRET = "8c1902d0284fad4ff6b052f0fdbfd50be1075088ba5d6f33b218734067568148";
    const ACCESS_TOKEN = "908366de1b222a5cabfda200e6e829633a7c51234ce655d18674b3de5d7e8f4c";

    const programStore = useProgramStore();

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

    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
        selectedIndex.value = appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
    }

    const screenWidth = ref(window.innerWidth);

    onMounted(async () => {
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

    programStore.traktClient = new TraktClient({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, accessToken: ACCESS_TOKEN, isUseProxy: false });
    const _traktClient = programStore.traktClient as TraktClient;
    new TraktApiTests(_traktClient).execute();
    console.log(`screenWidth=${screenWidth.value}`);
    console.log(`isWideScreen=${isWideScreen.value}`);
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

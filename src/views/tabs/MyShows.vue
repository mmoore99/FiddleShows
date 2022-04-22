<script setup lang="ts">
    import {
        ref,
        reactive,
        onMounted,
        computed,
        toRaw
    } from "vue";
    import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
    import { useRouter, useRoute } from "vue-router";
    import { useProgramStore } from "@/stores/ProgramStore";
    import { useShowStore } from "@/stores/ShowStore";
    import { ShowsService } from "@/services/ShowsService";
    import type { TraktClient } from "@/trakt/TraktClient";
    import { ShowContext } from "@/models/ShowContext";
    import { useLocalStorage } from "@vueuse/core";
    import MyShowsItem from "@/components/MyShowsItem.vue";
    import { plainToInstance, Type } from "class-transformer";
    import type { Storage } from '@ionic/storage';
    import {
        LastActivitiesComparer
    } from "@/helpers/LastActivitiesComparer";

    console.log("in MyShows.vue");
    const programStore = useProgramStore();
    const showStore = useShowStore();

    const _traktClient = programStore.traktClient as TraktClient;
    const _localStorage = programStore.localStorage as Storage

    const router = useRouter();
    const route = useRoute();

    let showContexts = ref<ShowContext[]>([]);
    const showsService = new ShowsService(_traktClient);

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
    
    const localShowContexts = ref<ShowContext[]>([]);

    const loadData = async () => {
        try {
            console.log("in MyShows.vue loadData");
            
            localShowContexts.value = await _localStorage.get(programStore.localStorageKeys.showContexts);
            if (localShowContexts.value && localShowContexts.value.length > 0) {
                console.log("Loading data from local storage");
                showContexts.value = plainToInstance<ShowContext, any>(ShowContext, localShowContexts.value);
            }
            
            if (await hasDataBeenUpdated()) {
                console.log("Loading data from api");
                showContexts.value = await showsService.getShowContextsForSelectedSources(showStore.myShowsOptions);
                await _localStorage.set(programStore.localStorageKeys.showContexts, toRaw(showContexts.value));
            }
            //console.log("localShowContexts after loadData: ", localShowContexts.value);

            showStore.showContexts = showContexts.value;
            console.log("ShowContexts:", showContexts.value);
            console.log("Finished - MyShows.vue loadData");
        } catch (e) {
            // Deal with the fact the chain failed
        }
        // `text` is not available here
    };

    const hasDataBeenUpdated = async () => {
        const savedLastActivities = await _localStorage.get(programStore.localStorageKeys.lastActivities);
        console.log(`savedLastActivities=`, savedLastActivities);
        const currentLastActivitiesResult = await _traktClient.Sync.getLastActivities();
        const currentLastActivities = currentLastActivitiesResult.content;
        console.log(`currentLastActivities=`, currentLastActivities);

        const compareResult = new LastActivitiesComparer(savedLastActivities, currentLastActivities!).compare();
        console.log(`compareResult=${compareResult}`);
        const result = compareResult.length > 0;
        console.log(`isRefresh=${result}`);
        
        await _localStorage.set(programStore.localStorageKeys.lastActivities, currentLastActivities);
        return result
    }
    
    loadData();

    onMounted(async () => {
        console.log("in MyShows.vue onMounted");
        // const showsService = new ShowsService(traktClient);
        // showContexts.value = await showsService.getShowContextsForSelectedSources(showStore.myShowsOptions);
    });

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
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>{{ $route.path }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div id="container">
                <ion-list>
                    <ion-item-divider sticky>In Progress, New Episodes Available ({{ showsWatchingEpisodesAvailable.length }})</ion-item-divider>
                    <MyShowsItem v-for="showContext in showsWatchingEpisodesAvailable" :show-context="showContext"></MyShowsItem>

                    <ion-item-divider sticky>Caught Up, New Episodes Scheduled ({{ caughtUpNewEpisodesScheduled.length }})</ion-item-divider>
                    <MyShowsItem v-for="showContext in caughtUpNewEpisodesScheduled" :show-context="showContext"></MyShowsItem>

                    <ion-item-divider sticky>Caught Up, No New Episodes Scheduled ({{ caughtUpNoNewEpisodesScheduled.length }})</ion-item-divider>
                    <MyShowsItem v-for="showContext in caughtUpNoNewEpisodesScheduled" :show-context="showContext"> </MyShowsItem>

                    <ion-item-divider sticky>Not Started Watching ({{ showsNotStartedWatching.length }})</ion-item-divider>
                    <MyShowsItem v-for="showContext in showsNotStartedWatching" :show-context="showContext"></MyShowsItem>
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
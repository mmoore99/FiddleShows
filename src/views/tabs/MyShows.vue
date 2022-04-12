<script setup lang="ts">
    import { ref, reactive, onMounted } from "vue";
    import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
    import { useRouter, useRoute } from "vue-router";
    import { useProgramStore } from "@/stores/ProgramStore";
    import { useShowStore } from "@/stores/ShowStore";
    import { ShowsService } from "@/services/ShowsService";
    import type { TraktClient } from "@/trakt/TraktClient";

    const programStore = useProgramStore();
    const showStore = useShowStore();

    const traktClient = programStore.traktClient as TraktClient;

    const router = useRouter();
    const route = useRoute();

    onMounted(async () => {
        const showsService = new ShowsService(traktClient);
        const showContexts = showsService.getShowContextsForSelectedSources(showStore.myShowsOptions);
        
    });
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
                <strong class="capitalize">MY SHOWS</strong>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
    #container {
        text-align: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }

    #container strong {
        font-size: 20px;
        line-height: 26px;
    }

    #container p {
        font-size: 16px;
        line-height: 22px;
        color: #8c8c8c;
        margin: 0;
    }

    #container a {
        text-decoration: none;
    }
</style>

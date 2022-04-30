<script setup lang="ts">
    import { computed, defineComponent, inject, onMounted, ref } from "vue";
    import { useRouter, useRoute } from "vue-router";

    import {
        IonIcon,
        IonLabel,
        IonPage,
        IonTabBar,
        IonTabButton,
        IonTabs,
        IonButtons,
        IonMenuButton,
        IonHeader,
        IonBadge,
        IonTitle,
        IonToolbar,
        IonRouterOutlet,
    } from "@ionic/vue";

    import { calendar, personCircle, tv, timerOutline, search, list } from "ionicons/icons";

    const isWideScreen = inject("isWideScreen");
    const screenWidth = inject("screenWidth");
    const router = useRouter();
    const route = useRoute();

    const beforeTabChange = () => {
        // do something before tab change
    };
    
    const afterTabChange = () => {
        // do something after tab change
    };
</script>

<template>
    <ion-page>
        <ion-tabs
            @ionTabsWillChange="beforeTabChange"
            @ionTabsDidChange="afterTabChange"
        >
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar v-if="!isWideScreen" slot="bottom">
                <ion-tab-button tab="my-shows" href="/tabs/my-shows">
                    <ion-icon :icon="tv"></ion-icon>
                    <ion-label> My Shows </ion-label>
                </ion-tab-button>

                <ion-tab-button tab="calendar" href="/tabs/calendar">
                    <ion-icon :icon="calendar"></ion-icon>
                    <ion-label> Calendar </ion-label>
                </ion-tab-button>

                <ion-tab-button tab="history" href="/tabs/history">
                    <ion-icon :icon="timerOutline"></ion-icon>
                    <ion-label> History </ion-label>
                </ion-tab-button>

                <ion-tab-button tab="lists" href="/tabs/lists">
                    <ion-icon :icon="list"></ion-icon>
                    <ion-label> Lists </ion-label>
                </ion-tab-button>

                <ion-tab-button tab="search" href="/tabs/search">
                    <ion-icon :icon="search"></ion-icon>
                    <ion-label> Search </ion-label>
                </ion-tab-button>

                
            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

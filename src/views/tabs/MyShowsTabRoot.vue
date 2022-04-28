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
        <ion-router-outlet></ion-router-outlet>
    </ion-page>
</template>

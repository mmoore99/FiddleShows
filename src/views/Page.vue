<template>
    <ion-page class="ion-page" style="height: 400px; position: unset;">
        <toolbar title="Page" backURL="/" />

        <ion-content class="ion-content" padding>
            <ion-button @click="goHome">Go home</ion-button>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';
import {
    IonContent,
    IonButton,
    IonButtons,
    IonBackButton,
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonModal,
} from "@ionic/vue";
import Toolbar from "../components/Toolbar.vue";

export default defineComponent({
    name: "Page",
    components: {
        IonHeader,
        IonPage,
        IonButton,
        IonButtons,
        IonBackButton,
        IonContent,
        IonTitle,
        IonToolbar,
        IonModal,
        Toolbar,
    },
    setup(props, context) {
        const router = useRouter()
        const route = useRoute()
        const modalIsOpen = ref(false);
        const goHome = () => {
            router.back();
        };

        return {
            goHome,
            modalIsOpen,
            router,
            route
        };
    },
});
</script>

<style>
</style>

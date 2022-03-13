<template>
    <ion-page class="ion-page">
        <toolbar title="Home" />
        <ion-content class="ion-content" padding>
            <router-link to="/page">Go to page</router-link>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    IonContent,
    IonButton,
    IonPage,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
} from "@ionic/vue";
import Toolbar from "../components/Toolbar.vue"

export default defineComponent({
    name: "Home",
    components: {
        IonHeader,
        IonPage,
        IonButton,
        IonContent,
        IonTitle,
        IonToolbar,
        IonCard,
        IonCardContent,
        Toolbar
    },
    setup() {
        return {};
    },
});
</script>

<style>
</style>

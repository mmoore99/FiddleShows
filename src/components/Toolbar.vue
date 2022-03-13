<template>
    <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-back-button :default-href="backURL" />
            </ion-buttons>
            <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
    </ion-header>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import {
    IonContent,
    IonButton,
    IonButtons,
    IonBackButton,
    IonHeader,
    IonTitle,
    IonToolbar,
} from "@ionic/vue";
export default defineComponent({
    name: "Toolbar",
    props: ['title', 'backURL'],
    components: {
        IonHeader,
        IonButton,
        IonButtons,
        IonBackButton,
        IonContent,
        IonTitle,
        IonToolbar,
    },
    emits: ["onClose"],
    setup: (props) => { },
});
</script>


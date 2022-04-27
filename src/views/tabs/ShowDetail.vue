<script setup lang="ts">
    import { defineComponent, ref, reactive } from "vue";
    import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton } from "@ionic/vue";
    import { useRouter, useRoute } from "vue-router";
    const router = useRouter();
    const route = useRoute();
    const segmentRef = ref(null)
    let selectedSegment = ref("episodes")

    const onSegmentChanged = (ev: CustomEvent) => {
        console.log("Segment changed", ev);
        console.log("selectedSegment=", selectedSegment.value);
        // debugger;
    };

    const onChangeToNews = () => {
        console.log("segmentRef=", segmentRef);
        selectedSegment.value = "news"
        segmentRef.value.$el.value = "news"
    };
</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>route ={{ $route.path }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-segment @ionChange="onSegmentChanged($event)" :value="selectedSegment" ref="segmentRef">
                <ion-segment-button value="episodes">
                    <ion-label>Episodes</ion-label>
                </ion-segment-button>
                <ion-segment-button value="info">
                    <ion-label>Show Info</ion-label>
                </ion-segment-button>
                <ion-segment-button value="comments">
                    <ion-label>Comments</ion-label>
                </ion-segment-button>
                <ion-segment-button value="news">
                    <ion-label>News</ion-label>
                </ion-segment-button>
            </ion-segment>

            <div id="container">
                <strong class="capitalize">SHOW DETAIL - {{ $route.params.id }}</strong>
                <ion-button @click="onChangeToNews" >Click Here for News</ion-button>
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

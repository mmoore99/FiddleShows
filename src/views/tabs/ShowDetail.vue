<script setup lang="ts">
    import { defineComponent, ref, reactive } from "vue";
    import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonicSlides } from "@ionic/vue";
    import { useRouter, useRoute } from "vue-router";
    import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
    import "swiper/css";
    import "@ionic/vue/css/ionic-swiper.css";
    import ShowInfo from "@/components/ShowInfo.vue";
    import ShowEpisodes from "@/components/ShowEpisodes.vue";
    import ShowComments from "@/components/ShowComments.vue";
    import ShowNews from "@/components/ShowNews.vue";
    const router = useRouter();
    const route = useRoute();
    let swiperInstance: any = null;
    const segmentRef: any = ref(null);
    const modules = [IonicSlides];
    const segments = ["episodes", "info", "comments", "news"];
    const segmentTitles = ["episodes", "show info", "comments", "news"];
    const slideTitles = ["Episodes Slide", "Show Info Slide", "Comments Slide", "News Slide"];
    let selectedSegment = ref("episodes");

    const onSegmentChanged = (ev: CustomEvent) => {
        console.log("Segment changed", ev);
        changeSlideTo(segments.findIndex((item) => item === ev.detail.value));
    };

    const changeSegmentTo = (newSegmentIndex: number) => {
        segmentRef!.value!.$el!.value = segments[newSegmentIndex];
    };

    const changeSlideTo = (newSlideIndex: number) => {
        swiperInstance.slideTo(newSlideIndex);
    };

    const onSwiper = (swiper: any) => {
        console.log("onSwiper", swiper);
        swiperInstance = swiper;
    };

    const onSlideChange = (swiper: any) => {
        console.log("onSlideChange");
        changeSegmentTo(swiper.realIndex);
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
                <ion-segment-button v-for="(segment, index) in segments" :value="segment">
                    <ion-label> {{ segmentTitles[index] }}</ion-label>
                </ion-segment-button>
            </ion-segment>

            <swiper :modules="modules" @swiper="onSwiper" @slideChange="onSlideChange" style="height: 100vh">
                <swiper-slide><ShowEpisodes></ShowEpisodes></swiper-slide>
                <swiper-slide>
                    <ShowInfo></ShowInfo>
                </swiper-slide>
                <swiper-slide>
                    <ShowComments></ShowComments>
                </swiper-slide>
                <swiper-slide>
                    <ShowNews></ShowNews>
                </swiper-slide>
            </swiper>
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

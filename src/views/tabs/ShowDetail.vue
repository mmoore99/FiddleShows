<script setup lang="ts">
    import { defineComponent, ref, reactive, onMounted, computed } from "vue";
    import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonicSlides } from "@ionic/vue";
    import { arrowBackOutline, ellipsisVerticalCircle } from "ionicons/icons";
    import { useRouter, useRoute } from "vue-router";
    import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
    import "swiper/css";
    import "@ionic/vue/css/ionic-swiper.css";
    import ShowInfo from "@/components/ShowInfo.vue";
    import ShowEpisodes from "@/components/ShowEpisodes.vue";
    import ShowComments from "@/components/ShowComments.vue";
    import ShowNews from "@/components/ShowNews.vue";
    import { useProgramStore } from "@/stores/ProgramStore";
    import { useShowStore } from "@/stores/ShowStore";
    import type { TraktClient } from "@/trakt/TraktClient";
    import type { Storage } from "@ionic/storage";
    import { LocalStorageService } from "@/services/LocalStorageService";
    import { ShowsService } from "@/services/ShowsService";
    import type { ShowContext } from "@/models/ShowContext";

    const router = useRouter();
    const route = useRoute();
    const _programStore = useProgramStore();
    const _showStore = useShowStore();
    const _traktClient = _programStore.traktClient as TraktClient;
    const _localStorage = _programStore.localStorage as Storage;
    const _localStorageService = new LocalStorageService();
    const _showsService = new ShowsService(_traktClient, _localStorageService);

    let swiperInstance: any = null;
    const segmentRef: any = ref(null);
    const modules = [IonicSlides];
    const segments = ["episodes", "info", "comments", "news"];
    const segmentTitles = ["episodes", "show info", "comments", "news"];
    let selectedSegment = ref("episodes");
    let selectedShowContext = ref<ShowContext | null>(null);
    const isDisplayBackButton = _showStore && _showStore.showContexts

    const props = defineProps({
        id: {
            type: String,
            required: true,
        },
    });

    onMounted(async () => {});

    const initialize = async () => {
        if (!_showStore.showContexts) {
            await _showsService.loadShowContexts();
        }

        selectedShowContext.value = getSelectedShowContext(props.id);
    };

    const getSelectedShowContext = (showId: string): ShowContext | null => {
        const searchId = parseInt(showId);
        const index = _showStore.showContexts!.findIndex((showContext) => {
            // console.log(showContext!.show!.ids!.trakt);
            return showContext!.traktId === searchId;
        });
        return index !== -1 ? _showStore.showContexts![index] : null;
    };

    const headerTitleDisplay = computed(() => {
        return selectedShowContext.value ? selectedShowContext.value.show!.title! : "";
    });

    console.log("id=", props.id);
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
    initialize();

</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar mode="ios">
                <ion-buttons slot="start">
                    <ion-button v-show="isDisplayBackButton" @click="router.back()">
                        <ion-icon :icon="arrowBackOutline"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title> {{ headerTitleDisplay }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button>
                        <ion-icon :icon="ellipsisVerticalCircle"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-segment mode="ios" @ionChange="onSegmentChanged($event)" :value="selectedSegment" ref="segmentRef">
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

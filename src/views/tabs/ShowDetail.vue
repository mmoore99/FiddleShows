<script setup lang="ts">
    import { computed, onMounted, ref } from "vue";
    import { IonButtons, IonContent, IonHeader, IonicSlides, IonLabel, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/vue";
    import { arrowBackOutline, ellipsisVerticalCircle } from "ionicons/icons";
    import { useRoute, useRouter } from "vue-router";
    import { Swiper, SwiperSlide } from "swiper/vue";
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
    
    interface IXYCoordinates {x: number,  y:number}
    interface ISegmentScrollPositions {
        [index: string]: IXYCoordinates|null;
    }
    
    const router = useRouter();
    const route = useRoute();
    const _programStore = useProgramStore();
    const _showStore = useShowStore();
    const _traktClient = _programStore.traktClient as TraktClient;
    const _localStorage = _programStore.localStorage as Storage;
    const _localStorageService = new LocalStorageService();
    const _showsService = new ShowsService(_traktClient, _localStorageService);

    let swiperInstance: any = null;
    const contentRef: any = ref(null);
    const segmentRef: any = ref(null);
    const segmentLabelRef: any = ref(null);
    const episodesRef: any = ref(null);
    const episodesContainerRef: any = ref(null);
    const modules = [IonicSlides];
    const segments = ["episodes", "info", "comments", "news"];
    const segmentTitles = ["episodes", "show info", "comments", "news"];
    const segmentScrollPositions: ISegmentScrollPositions = {};
    let selectedSegment = ref("episodes");
    let selectedShowContext = ref<ShowContext | null>(null);
    const isDisplayBackButton = _showStore && _showStore.showContexts;

    const props = defineProps({
        id: {
            type: String,
            required: true,
        },
    });

    onMounted(async () => {
        console.log(segmentRef);
    });

    const initialize = async () => {
        if (!_showStore.showContexts) {
            await _showsService.loadShowContexts();
        }

        const selectedShowContextIndex = getSelectedShowContextIndex(props.id);
        selectedShowContext.value = _showStore.showContexts![selectedShowContextIndex];
        console.log("selectedShowContext=", selectedShowContext.value);

        if (!selectedShowContext.value!.show!.seasons) {
            await _showsService.loadSeasonsAndEpisodesForShow(selectedShowContext.value!);
        }
        console.log("selectedShowContext=", selectedShowContext.value);
        console.log("showStoreShowContext=", _showStore.showContexts![selectedShowContextIndex]);
        
        initializeSegmentScrollPositions()
    };

    const initializeSegmentScrollPositions = () => {
        segments.forEach((segment) => segmentScrollPositions[segment] = null);
    };

    const getSelectedShowContextIndex = (showId: string): number => {
        const searchId = parseInt(showId);
        return _showStore.showContexts!.findIndex((showContext) => showContext!.traktId === searchId);
    };

    const headerTitleDisplay = computed(() => {
        return selectedShowContext.value ? selectedShowContext.value.show!.title! : "";
    });

    console.log("id=", props.id);

    const onSegmentChanged = (ev: CustomEvent) => {
        console.log("Segment changed to:", ev.detail.value);
        if (segmentScrollPositions[ev.detail.value] === null) return; 
        const x = segmentScrollPositions[ev.detail.value]!.x
        scrollToPoint(segmentScrollPositions![ev.detail.value]!.x, segmentScrollPositions[ev.detail.value]!.y)
    };

    const scrollToTop = (duration?:number) => {
        duration = typeof duration == 'number' ? duration : 0;
        contentRef.value.$el.scrollToTop(duration);
    };

    const scrollToBottom = (duration?:number) => {
        duration = typeof duration == 'number' ? duration : 0;
        contentRef.value.$el.scrollToBottom(duration);
    };

    const scrollToPoint = (x?:number, y?:number, duration?: number) => {
        x = typeof x == 'number' ? x : 0
        y = typeof y == 'number' ? y : 0
        duration = typeof duration == 'number' ? duration : 0
        contentRef.value.$el.scrollToPoint(x, y, duration);
    };

    const onScrollStart = (event: any) => {
        //console.log("logScrollStart : When Scroll Starts", event);
    };

    const onScrollEnd = (event: any) => {
        // console.log("logScrollEnd : When Scroll Ends", event);
        console.log(`logScrollEnd : When Scroll Ends: Current X, Current Y ${event.srcElement.detail.currentX},${event.srcElement.detail.currentY}`);
        segmentScrollPositions[selectedSegment.value] = {x: event.srcElement.detail.currentX, y: event.srcElement.detail.currentY}
    };

    const onScrolling = (event: any) => {
        //console.log("logScrolling : When Scrolling", event);
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
                    <ion-button @click="scrollToTop">
                        <ion-icon :icon="ellipsisVerticalCircle"></ion-icon>
                    </ion-button>
                    <ion-button @click="scrollToBottom">
                        <ion-icon :icon="ellipsisVerticalCircle"></ion-icon>
                    </ion-button>
                    <ion-button @click="scrollToPoint(0,50)">
                        <ion-icon :icon="ellipsisVerticalCircle"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content ref="contentRef" scrollEvents="true"  @ionScrollEnd="onScrollEnd($event)">
            <div slot="fixed" style="height: 40px; width: 100%">
                <ion-segment mode="ios" @ionChange="onSegmentChanged($event)" v-model="selectedSegment" ref="segmentRef">
                    <ion-segment-button v-for="(segment, index) in segments" :value="segment">
                        <ion-label ref="segmentLabelRef">
                            {{ segmentTitles[index] }}
                        </ion-label>
                    </ion-segment-button>
                </ion-segment>
            </div>
            <ShowEpisodes v-show="selectedSegment === 'episodes'" :selected-show-context="selectedShowContext" ref="episodesRef"></ShowEpisodes>
            <ShowInfo v-show="selectedSegment === 'info'"></ShowInfo>
            <ShowComments v-show="selectedSegment === 'comments'"></ShowComments>
            <ShowNews v-show="selectedSegment === 'news'"></ShowNews>
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

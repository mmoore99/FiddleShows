<script setup lang="ts">
    import { ref, reactive, computed, onMounted } from "vue";
    import {
        IonList,
        IonItemDivider,
        IonItem,
        IonButtons,
        IonContent,
        IonHeader,
        IonicSlides,
        IonLabel,
        IonPage,
        IonSegment,
        IonSegmentButton,
        IonTitle,
        IonToolbar,
        IonSkeletonText,
    } from "@ionic/vue";
    import { ShowContext } from "@/models/ShowContext";
    import { chevronUp, chevronDown, filterCircleOutline, calendar, personCircle, tv, timerOutline, search, list, funnel, heart } from "ionicons/icons";
    import type { SeasonContext } from "@/models/SeasonContext";
    import type { EpisodeContext } from "@/models/EpidodeContext";

    const props = defineProps({
        selectedShowContext: {
            type: ShowContext,
            required: true,
        },
    });
    const emit = defineEmits(["update:modelValue", "submit"]);

    const state = reactive({});
    const episodesContainerRef: any = ref(null);
    const seasonsListRef: any = ref(null);

    onMounted(async () => {
    });

    const isDataLoaded = computed(() => {
        console.log("prop.selectedShowContext", props.selectedShowContext);
        return props.selectedShowContext.seasonContexts && props.selectedShowContext.seasonContexts.length > 0;
    });

    const toggleDisplaySeason = (seasonContext: SeasonContext) => {
        seasonContext.isDisplayEpisodes = !seasonContext.isDisplayEpisodes;
    };

    const isDisplayEpisodes = (showContext: ShowContext, seasonContextIndex: number) => {
        return showContext.seasonContexts[seasonContextIndex].isDisplayEpisodes || showContext.seasonContexts.length - 1 === seasonContextIndex;
    };

    const formattedAiredDate = (episodeContext: EpisodeContext) => {
        return episodeContext.formattedAiredDate();
        // console.log("formattedAiredDate:episode", episodeContext.episode);
        // console.log("formattedAiredDate:episode.firstAired", episodeContext.episode?.firstAired);
        // console.log("formattedAiredDate:episode.title", episodeContext.episode?.title);
        // // if (episodeContext.episode?.title === "Special: The First Three Years") {
        // //     console.log("title encountered");
        // //     return "title encountered"
        // // }
        // if (episodeContext.episode!.firstAired === null) {
        //     console.log("null encountered");
        //     return "not available";
        // }
        // console.log("date encountered");
        // return episodeContext.episode!.firstAired!.toLocaleDateString("en-us", {
        //     weekday: "long",
        //     year: "numeric",
        //     month: "short",
        //     day: "numeric",
        // });

        // return episodeContext.episode!.firstAired!.toDateString();
        // return episodeContext.episode?.firstAired
    };

    defineExpose({});
</script>

<template>
    <div id="ShowEpisodesContainer" style="width: 100%; height: 100%; margin-top: 32px" ref="episodesContainerRef">
        <ion-list v-show="isDataLoaded" ref="seasonsListRef" style="padding-top: 0">
            <div v-for="(seasonContext, seasonIndex) in selectedShowContext.seasonContexts">
                <ion-item-divider  @click="" >
                    <ion-label>
                        {{ `Season ${seasonContext.season.number}` }}
                    </ion-label>
                    <ion-icon class="chevron" slot="end" :icon="chevronDown" v-show="seasonContext.isDisplayEpisodes" @click="toggleDisplaySeason(seasonContext)"></ion-icon>
                    <ion-icon class="chevron" slot="end" :icon="chevronUp" v-show="!seasonContext.isDisplayEpisodes" @click="toggleDisplaySeason(seasonContext)"></ion-icon>
                </ion-item-divider>
                <ion-item v-for="(episodeContext, episodeIndex) in seasonContext.episodeContexts" v-show="isDisplayEpisodes(selectedShowContext, seasonIndex)">
                    <ion-label @click="">
                        <h3 style="font-size: 15px; font-weight: 600">
                            {{
                                `S${seasonContext.season.number.toString().padStart(2, "0")}E${episodeContext.episode.number.toString().padStart(2, "0")} - ${
                                    episodeContext.episode.title
                                }`
                            }}
                        </h3>
                        <h4>
                            {{ `Aired: ${episodeContext.formattedAiredDate(episodeContext)}` }}
                        </h4>
                    </ion-label>
                    <ion-icon class="chevron" slot="end" :icon="ellipsisHorizontalOutline" @click=""></ion-icon>
                </ion-item>
            </div>
        </ion-list>
        <ion-list v-show="!isDataLoaded">
            <ion-item-divider v-for="index in 15" :key="index" @click="">
                <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
            </ion-item-divider>
        </ion-list>
    </div>
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

    ion-item-divider {
        color: black;
        font-weight: 600;
        height: 31px;
        background: #e7e1e1;
        top: 32px;
        position: -webkit-sticky; 
        position: sticky
    }
</style>

<style></style>

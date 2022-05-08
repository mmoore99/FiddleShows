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

    onMounted(async () => {});

    const isDataLoaded = computed(() => {
        console.log("prop.selectedShowContext", props.selectedShowContext);
        return props.selectedShowContext.show!.seasons && props.selectedShowContext.show!.seasons.length > 0;
    });

    defineExpose({});
</script>

<template>
    <div id="ShowEpisodesContainer" style="width: 100%; height: 100%; margin-top: 32px" ref="episodesContainerRef">
        <ion-list v-show="isDataLoaded" ref="seasonsListRef">
            <div v-for="seasonContext in selectedShowContext.seasonContexts">
                <ion-item-divider @click="">
                    {{ `Season ${seasonContext.season.number}` }}
                </ion-item-divider>
                <ion-list>
                    <ion-item v-for="episodeContext in seasonContext.episodeContexts">
                        {{ `${episodeContext.episode.number} ${episodeContext.episode.title}`}}
                    </ion-item>
                </ion-list>
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
</style>

<style></style>

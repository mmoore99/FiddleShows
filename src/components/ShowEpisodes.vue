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
    } from "@ionic/vue";
    import { ShowContext } from "@/models/ShowContext.ts";

    const props = defineProps({
        selectedShowContext: {
            type: ShowContext,
            default: null,
        },
    });
    const emit = defineEmits(["update:modelValue", "submit"]);

    const state = reactive({});
    const episodesContainerRef: any = ref(null);
    const seasonsListRef: any = ref(null);


    onMounted(async () => {});

    const scrollList = () => {
        console.log("In scrollList");
        seasonsListRef.value.$el.scrollTop = 500;
    };

    function myFunction() {}

    const isDataLoaded = computed(() => {
        console.log("prop.selectedShowContext", props.selectedShowContext);
        return props.selectedShowContext.show.seasons && props.selectedShowContext.show.seasons.length > 0;
    });

    const logScrollTop = () => {
        debugger
        console.log("episodesContainer ScrollTop=", episodesContainerRef.value.scrollTop);
        console.log("seasonsList ScrollTop=", seasonsListRef.value.$el.scrollTop);
    };

    defineExpose({
        scrollList
    });
</script>

<template>
    <div id="ShowEpisodesContainer" style="width: 100%; height: 100%; margin-top: 32px;" ref="episodesContainerRef">
        <ion-list v-show="isDataLoaded" ref="seasonsListRef">
            <ion-item-divider v-for="season in selectedShowContext.show.seasons" @click="logScrollTop">
                {{ `Season ${season.number}` }}
            </ion-item-divider>
        </ion-list>
        <ion-list v-show="!isDataLoaded"> No Season Data Loaded </ion-list>
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

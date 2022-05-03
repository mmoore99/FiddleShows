<script setup>
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

    onMounted(async () => {});

    function myFunction() {}

    const isDataLoaded = computed(() => {
        console.log("prop.selectedShowContext", props.selectedShowContext);
        return props.selectedShowContext.show.seasons && props.selectedShowContext.show.seasons.length > 0;
    });

    defineExpose({});
</script>

<template>
    <div id="" style="width: 100%; height: 100%">
        <ion-list v-if="isDataLoaded">
            <ion-item-divider v-for="season in selectedShowContext.show.seasons">
                {{ `Season ${season.number}` }}
            </ion-item-divider>
        </ion-list>
        <ion-list v-if="!isDataLoaded"> No Season Data Loaded </ion-list>
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

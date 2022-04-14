<script setup>
    import { ShowContext } from "@/models/ShowContext.ts";

    const props = defineProps({
        showContext: {
            type: ShowContext
        }
    });

</script>

<template>
    <ion-item >
        <ion-thumbnail slot="start" style="height: 75px;">
            <img src="https://image.tmdb.org/t/p/w154//cXUqtadGsIcZDWUTrfnbDjAy8eN.jpg" alt="" />
        </ion-thumbnail>
        <ion-label>
            <h3 style="font-size: 15px; font-weight: 600">{{ showContext.show.title }}</h3>
            <h4>{{ showContext.nextEpisodeDisplay() }}</h4>
            <h4>{{ showContext.episodesLeftDisplay() }}</h4>
        </ion-label>
    </ion-item>

</template>

<style scoped>

</style>

<style>

</style>

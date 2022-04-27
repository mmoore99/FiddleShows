<script setup>
    import { ShowContext } from "@/models/ShowContext.ts";
    import { IonItem, IonItemSliding, IonThumbnail, IonLabel, IonItemOptions, IonItemOption } from "@ionic/vue";
    import { ellipsisHorizontalOutline } from "ionicons/icons";
    import { ref } from "vue";

    const props = defineProps({
        showContext: {
            type: ShowContext,
        },
    });
    
    const ionSlidingItem = ref(null);

    const emit = defineEmits(['showItemSwiped'])

    const onItemSwipe = (event, showContext) => {
        console.log("in onItemSwipe", event, showContext, showContext.show.title);
        emit("showItemSwiped")
         //debugger;
         //ionSlidingItem.value.$el.close();
    };
</script>

<template>
    <ion-item-sliding @ionSwipe="onItemSwipe($event, showContext)" ref="ionSlidingItem">
        <ion-item>
            <ion-thumbnail slot="start" style="height: 75px">
                <img src="https://image.tmdb.org/t/p/w154//cXUqtadGsIcZDWUTrfnbDjAy8eN.jpg" alt="" />
            </ion-thumbnail>
            <ion-label>
                <h3 style="font-size: 15px; font-weight: 600">
                    {{ showContext.show.title }}
                </h3>
                <h4>
                    {{ showContext.nextEpisodeDisplay() }}
                </h4>
                <h4>
                    {{ showContext.episodesLeftDisplay() }}
                </h4>
            </ion-label>
            <ion-icon class="chevron" slot="end" :icon="ellipsisHorizontalOutline" @click=""></ion-icon>
        </ion-item>
        <ion-item-options side="start" expandable="true">
            <ion-item-option color="primary">Mark Unread</ion-item-option>
            <ion-item-option color="danger">Option 2</ion-item-option>
        </ion-item-options>

        <ion-item-options side="end">
            <ion-item-option color="danger">Delete</ion-item-option>
        </ion-item-options>
    </ion-item-sliding>
</template>

<style scoped></style>

<style></style>

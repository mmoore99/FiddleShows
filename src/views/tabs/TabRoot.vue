<template>
  <ion-page>
    <!-- <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>default title</ion-title>
      </ion-toolbar>
    </ion-header>-->
    <ion-tabs
      class="only-on-narrow-screen"
      @ionTabsWillChange="beforeTabChange"
      @ionTabsDidChange="afterTabChange"
    >
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar v-if="!isWideScreen" slot="bottom">
        <ion-tab-button tab="schedule" href="/tabs/schedule">
          <ion-icon :icon="calendar"></ion-icon>
          <ion-label>Schedule</ion-label>
          <ion-badge>6</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="speakers" href="/tabs/speakers">
          <ion-icon :icon="personCircle"></ion-icon>
          <ion-label>Speakers</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';

import {
  IonIcon,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonButtons,
  IonMenuButton,
  IonHeader,
  IonBadge,
  IonTitle,
  IonToolbar,
  IonRouterOutlet
} from "@ionic/vue";

import { calendar, personCircle } from "ionicons/icons";

export default defineComponent({
  components: {
    IonIcon,
    IonLabel,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonButtons,
    IonTabs,
    IonMenuButton,
    IonHeader,
    IonBadge,
    IonTitle,
    IonToolbar,
    IonRouterOutlet
  },
  setup() {
    const isWideScreen = inject('isWideScreen');
    const screenWidth = inject('screenWidth')
    const router = useRouter()
    const route = useRoute()

    const beforeTabChange = () => {
      // do something before tab change
    };
    const afterTabChange = () => {
      // do something after tab change
    };


    return {
      router,
      route,
      calendar,
      personCircle,
      beforeTabChange,
      afterTabChange,
      isWideScreen,
      screenWidth
    };
  }
});
</script>
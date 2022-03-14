<template>
  <ion-app style="flex-direction:row; justify-content: unset;">
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item
                @click="selectedIndex = i"
                router-direction="root"
                :router-link="p.url"
                lines="none"
                detail="false"
                class="hydrated"
                :class="{ selected: selectedIndex === i }"
              >
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <!-- <ion-router-outlet id="main-content" style="background-color: green; width: 600px;"></ion-router-outlet> -->
      <ion-router-outlet id="main-content"></ion-router-outlet>
      <!-- <div
        class="split-pane-main test-class"
        style="flex: unset; width: 600px; background-color: red;"
      >
        <ion-router-outlet id="main-content" style="background-color: green; width: 600px;"></ion-router-outlet>
      </div>-->
      <!-- <div style="width: 300px; height: 400px; background-color: red;">
        <ion-router-outlet id="main-content" style="width: 300px"></ion-router-outlet>
      </div>-->
    </ion-split-pane>
    <!-- <router-view name="extra" style="pointer-events: none !important"></router-view> -->
  </ion-app>
</template>

<script lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane
} from "@ionic/vue";

import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  bookmarkSharp,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp
} from "ionicons/icons";

import { defineComponent, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonMenuToggle,
    IonRouterOutlet,
    IonSplitPane
  },
  setup() {
    const selectedIndex = ref(0);
    const appPages = [
      {
        title: "Tabs",
        url: "/tabs",
      },
      {
        title: "Other",
        url: "/other",
      },
    ];

    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      selectedIndex.value = appPages.findIndex(
        page => page.title.toLowerCase() === path.toLowerCase()
      );
    }

    const router = useRouter()
    const route = useRoute()

    return {
      selectedIndex,
      appPages,
      archiveOutline,
      archiveSharp,
      bookmarkOutline,
      bookmarkSharp,
      heartOutline,
      heartSharp,
      mailOutline,
      mailSharp,
      paperPlaneOutline,
      paperPlaneSharp,
      trashOutline,
      trashSharp,
      warningOutline,
      warningSharp,
      isSelected: (url: string) => (url === route.path ? "selected" : "")
    };
  }
});
</script>

<style>
.test-class {
  flex: unset;
  width: 600px;
  background-color: red;
}
</style>
<!-- <template>
  <ion-app style="flex-direction:row; justify-content: unset;">
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
              <ion-item
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
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template> -->

<template>
    <ion-app>
        <ion-content>
            <ion-grid style="height: 100vh;" class="ion-no-padding">
                <ion-row style="height: 100vh;">
                    <ion-col v-if="isWideScreen" class="col-1 side-column" size="2.5">
                        <div style="height: 100%; background-color: red;">
                            <!-- <h1>1 of 3</h1> -->
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
                                        style="cursor:pointer;"
                                    >
                                        <ion-label>{{ p.title }}</ion-label>
                                    </ion-item>
                                </ion-menu-toggle>
                            </ion-list>
                        </div>
                    </ion-col>
                    <ion-col class="col-2" :size="tabsColSize">
                        <div style="height: 100%; background-color: blue;">
                            <!-- <h1>2 of 3</h1> -->
                            <ion-router-outlet id="main-content"></ion-router-outlet>
                        </div>
                    </ion-col>
                    <ion-col v-if="isWideScreen" class="col-3 side-column">
                        <div style="height: 100%; background-color: green;">
                            <!-- <h1>3 of 3</h1> -->
                        </div>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-app>
</template>

<script lang="ts">
import {
    IonApp,
    IonGrid,
    IonRow,
    IonCol,
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

import {computed, defineComponent, onMounted, provide, ref} from "vue";
import {useRouter, useRoute} from 'vue-router';
import ShowService from './services/ShowService';
import TodoModel from '@/services/TodoModel';
import Person from '@/services/Person';


export default defineComponent({
    name: "App",
    components: {
        IonApp,
        IonGrid,
        IonRow,
        IonCol,
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

        // var todoModel1: any = TodoModel(['todo 3', 'todo 4']);
        // console.log(todoModel1.todos);

        // var todoModel2: any = TodoModel(['todo 5', 'todo 6']);
        // console.log(todoModel2.todos);

        // var person1 = new (Person as any)("Bob", 38, true);
        // // creates a Person instance with properties name: Alice, age: 32, isDeveloper: false and a method writesCode
        // var person2 = new (Person as any)("Alice", 32);

        // // prints out: This person does write code
        // person1.writesCode();
        // // prints out: this person does not write code
        // person2.writesCode();


        const path = window.location.pathname.split("folder/")[1];
        if (path !== undefined) {
            selectedIndex.value = appPages.findIndex(
                page => page.title.toLowerCase() === path.toLowerCase()
            );
        }

        let screenWidth = ref(screen.width);

        const router = useRouter()
        const route = useRoute()
        
        onMounted(() => {
            window.onresize = () => {
                screenWidth.value = window.innerWidth
                console.log(`screenWidth=${screenWidth.value}`)
                console.log(`isWideScreen=${isWideScreen.value}`)
            }
        });

        const isWideScreen = computed(() => {
            return screenWidth.value >= 768;
        });

        const tabsColSize = computed(() => {
            return isWideScreen.value ? 6.3 : 12;
        });


        provide('isWideScreen', isWideScreen)
        provide('screenWidth', screenWidth)

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
            isSelected: (url: string) => (url === route.path ? "selected" : ""),
            isWideScreen,
            screenWidth,
            tabsColSize
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

.only-on-wide-screen {
    display: none;
}

@media screen and (min-width: 768px) {
    .only-on-wide-screen {
        display: unset;
    }
}
</style>
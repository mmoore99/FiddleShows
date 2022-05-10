import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import { IonicVue } from "@ionic/vue";
import { Storage } from "@ionic/storage";
import { useLocalStorage, useMouse, usePreferredDark } from '@vueuse/core'
import { useProgramStore } from "@/stores/ProgramStore";
import { useShowStore } from "@/stores/ShowStore";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import {
    TraktClient
} from "@/trakt/TraktClient";
import {
    MyShowsOptions
} from "@/models/MyShowsOptions";

const PROXY_URL = "https://fierce-castle-85156.herokuapp.com/";
const CLIENT_ID = "f3939aa847cf9df9eb698298ec01c499bd0b8b0d76c0a1920a6e4c04e3130c39";
const CLIENT_SECRET = "8c1902d0284fad4ff6b052f0fdbfd50be1075088ba5d6f33b218734067568148";
const ACCESS_TOKEN = "908366de1b222a5cabfda200e6e829633a7c51234ce655d18674b3de5d7e8f4c";

const pinia = createPinia();



const app = createApp(App)
    .use(IonicVue)
    .use(router)
    .use(pinia);



// all of this stuff using pinia must be after createApp
const programStore = useProgramStore();
const showStore = useShowStore();

const myShowsOptions = new MyShowsOptions();
myShowsOptions.showSources.isWatchedShows = true;
myShowsOptions.showSources.isWatchList = true;
showStore.myShowsOptions = myShowsOptions;

programStore.traktClient = new TraktClient({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, accessToken: ACCESS_TOKEN, isUseProxy: false });

const localStorage = new Storage();
localStorage.create().then(() => programStore.localStorage = localStorage);


router.isReady().then(() => {
    app.mount("#app");
});

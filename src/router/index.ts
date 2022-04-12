import { createRouter, createWebHistory } from "@ionic/vue-router";

import Home from "../views/Home.vue";
import Page from "../views/Page.vue";
import Extra from "../views/Extra.vue";

// const routes = [
//   { path: "/", component: Home },
//   { path: "/page", components: { default: Page, extra: Extra } },
// ]

const routes = [
    {
        path: "",
        // component: () => import("../App.vue"),
        redirect: "/tabs",
    },
    {
        path: "/tabs",
        component: () => import("../views/tabs/TabRoot.vue"),
        children: [
            {
                path: "",
                redirect: "/tabs/my-shows",
            },
            {
                path: "/tabs/my-shows",
                component: () => import("../views/tabs/MyShows.vue"),
            },
            {
                path: "/tabs/lists",
                component: () => import("../views/tabs/Lists.vue"),
            },
            {
                path: "/tabs/calendar",
                component: () => import("../views/tabs/Calendar.vue"),
            },
            {
                path: "/tabs/history",
                component: () => import("../views/tabs/History.vue"),
            },
            {
                path: "/tabs/search",
                component: () => import("../views/tabs/Search.vue"),
            },
        ],
    },

    {
        path: "/other",
        component: () => import("../views/Other.vue"),
    },
];

// https://vitejs.dev/guide/env-and-mode.html
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;

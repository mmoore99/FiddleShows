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
        component: () => import("../App.vue"),
    },
    {
        path: "/tabs",
        component: () => import("../views/tabs/TabRoot.vue"),
        children: [
            {
                path: "",
                redirect: "/tabs/speakers",
            },
            {
                path: "/tabs/speakers",
                component: () => import("../views/tabs/Speakers.vue"),
            },
            {
                path: "/tabs/schedule",
                component: () => import("../views/tabs/Schedule.vue"),
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

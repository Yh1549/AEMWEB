import { createPinia } from "pinia";
import VCalendar from "v-calendar";
import { createApp } from "vue";

import "v-calendar/dist/style.css";
import App from "./App.vue";
import "./permission";
import router from "./router/router";
import "./style.css";

import headerCom from "./components/header.vue";
import loadSpinner from "./components/loadSpinner.vue";
import { verifySetting } from "./verify";
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {});
app.directive("verify", verifySetting);

// components
app.component("headerCom", headerCom);
app.component("loadSpinner", loadSpinner);
app.mount("#app");

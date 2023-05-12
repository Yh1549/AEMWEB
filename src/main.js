import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import VCalendar from 'v-calendar';

import router from "./router/router";
import "./style.css";
import App from "./App.vue";
import "./permission";
import 'v-calendar/dist/style.css';

import headerCom from "./components/header.vue";
import loadSpinner from "./components/loadSpinner.vue";
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {});
// components
app.component('headerCom', headerCom);
app.component('loadSpinner', loadSpinner);
app.mount("#app");


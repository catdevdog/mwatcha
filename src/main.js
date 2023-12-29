import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initFirebase } from "./firebase";
import "./assets/styles/common.scss";

// Firebase 초기화 실행
const { analytics, db } = initFirebase();

const vueApp = createApp(App);
vueApp.config.globalProperties.$analytics = analytics;
vueApp.config.globalProperties.$db = db;
vueApp.use(router);
vueApp.mount("#app");

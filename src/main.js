import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./assets/styles/common.scss";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDBN7-a1wgzqLIVRdbbP_EvQ3IRBsv41o",
  authDomain: "mwatcha.firebaseapp.com",
  projectId: "mwatcha",
  storageBucket: "mwatcha.appspot.com",
  messagingSenderId: "282714271242",
  appId: "1:282714271242:web:6d797b35a45bb4b24679f3",
  measurementId: "G-9ZM6KBTKEH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const vueApp = createApp(App);
vueApp.config.globalProperties.$analytics = analytics;
vueApp.use(router);
vueApp.mount("#app");

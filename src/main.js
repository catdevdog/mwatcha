import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./assets/styles/common.scss";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase

const vueApp = createApp(App);

vueApp.use(router);
vueApp.mount("#app");

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

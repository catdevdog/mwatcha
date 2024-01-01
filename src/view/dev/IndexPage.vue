<template>
  <iframe
    :src="`https://www.youtube.com/embed/SVbtT0U-cj8`"
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>
<script setup>
import { onMounted } from "vue";
import { getClassifiedVideos } from "@/api/inquiry";
import { initFirebase } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
  where,
} from "firebase/firestore";

const { db } = initFirebase();
//PL1ZI099H6FYwUeZHR5btiNSJ8G_-BIXaD

onMounted(async () => {
  const { resultVideos, nextStart } = await getClassifiedVideos(
    ["PL1ZI099H6FYzptNutJOlI4H-5dpIzldyx"],
    5,
    ["date", "desc"]
  );
  // console.log(resultVideos);

  const docRef = collection(db, "VIDEOS");

  let q;

  q = query(docRef, where("videoId", "==", "SVbtT0U-cj8"));

  const querySnapshot = await getDocs(q);
  // const nextStart = querySnapshot.docs[querySnapshot.docs.length - 1];

  // const resultVideos = [];

  querySnapshot.forEach((doc) => {
    resultVideos.push(doc.data());
  });
  console.log(resultVideos);
});
</script>
<style lang="scss" scoped></style>

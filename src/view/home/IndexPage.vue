<template>
  <div>
    <iframe
      width="340"
      height="200"
      src="https://www.youtube.com/embed/3UAzSmEvsXs"
      frameborder="0"
      allowfullscreen
    ></iframe>
    test
  </div>
</template>
<script setup>
import { onMounted, getCurrentInstance } from "vue";
// import { getChannelPlaylists } from "@/api/index";
import { collection, getDocs } from "firebase/firestore";

onMounted(async () => {
  const { proxy } = getCurrentInstance();
  const querySnapshot = await getDocs(collection(proxy.$db, "test"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
    const result = doc.data();
    console.log(result);
  });
});
</script>
<style lang="scss"></style>

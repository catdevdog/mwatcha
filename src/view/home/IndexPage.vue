<template>
  <div>
    <iframe
      width="340"
      height="200"
      src="https://www.youtube.com/embed/3UAzSmEvsXs"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { getChannelPlaylists } from "@/api/index";

onMounted(async () => {
  const result = await getChannelPlaylists();
  console.log(result);
});
</script>
<style lang="scss"></style>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  video: {
    id: String,
    title: String,
    thumbnail: String,
  },
});
</script>
<template>
  <div class="player">
    <img :src="video.thumbnail" alt="" />
    <!-- <iframe
      width="300"
      height="200"
      :src="`https://www.youtube.com/embed/${videoId}`"
      frameborder="0"
      allowfullscreen
    ></iframe> -->
  </div>
</template>
<style lang="scss">
.player {
  height: 280px;
  overflow: hidden;
  border-radius: 8px;
  img {
    height: 280px;
    object-fit: cover;
  }
}
</style>

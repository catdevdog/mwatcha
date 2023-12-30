<script setup>
import { defineProps, onMounted, ref } from "vue";

const props = defineProps({
  video: {
    channel: String,
    channelId: String,
    id: String,
    title: String,
    thumbnail: String,
    date: String,
    description: String,
    view: Number,
  },
});

const trans = ref(false);
onMounted(() => {
  trans.value = ref(true);
});
</script>
<template>
  <div class="player">
    <img :src="video.thumbnail" alt="" :class="{ trans: trans }" />
    <!-- <iframe
      width="300"
      height="200"
      :src="`https://www.youtube.com/embed/${videoId}`"
      frameborder="0"
      allowfullscreen
    ></iframe> -->
  </div>
  <div style="color: #fff">
    <p>{{ video.date }}</p>
    <p>{{ video.title }}</p>
  </div>
</template>
<style lang="scss">
.player {
  overflow: hidden;
  border-radius: 8px;
  background-color: #000;
  img {
    min-width: 320px;
    height: 180px;
    min-height: 180px;
    object-fit: cover;
    opacity: 0.01;
    &.trans {
      opacity: 1;
      // transition: 10s;
    }
  }
}
</style>

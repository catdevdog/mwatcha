<script setup>
import { defineProps } from "vue";
import MwaPlayer from "./MwaPlayer.vue";

const props = defineProps({
  data: {
    channel: String,
    count: Number,
    description: String,
    id: String,
    name: String,
    open: Boolean,
    video: () => [],
  },
});
</script>
<template>
  <div class="playlist">
    <div class="playlist-title">
      {{ data.name }}
    </div>
    <div class="playlist-wrap">
      <div class="playlist-player" v-for="video in data.videos" :key="video.id">
        <mwa-player :video="video" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.playlist {
  &-title {
    font-family: "TheJamsil3Regular";
    font-size: 32px;
    color: #fff;
  }
  &-wrap {
    margin-top: 20px;
    display: flex;
    gap: 20px;
  }
}
</style>

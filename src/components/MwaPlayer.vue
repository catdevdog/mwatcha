<script setup>
import { defineProps, onMounted, ref } from "vue";
import { covertNum } from "@/store/index";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  video: {
    channel: String,
    channelId: String,
    id: String,
    title: String,
    thumbnail: String,
    date: String,
    description: String,
    detail: () => {},
  },
  size: String,
});

onMounted(() => {
  // console.log(props.video);
});
const goVideo = () => {
  router.push(`/video/${props.video.id}`);
};
</script>
<template>
  <div :class="['player', `player-${size}`]" @click="goVideo">
    <img :src="video.thumbnail.default.url" alt="" />
    <div class="dimmed"></div>
  </div>
  <div class="player-data">
    <p :class="`title ${size}`">
      <span>{{ video.title }}</span>
    </p>
    <p class="date">{{ video.date }}</p>
    <p :class="`count ${size}`">조회수 {{ covertNum(video.viewCount) }}회</p>
  </div>
</template>
<style lang="scss">
.player {
  overflow: hidden;
  border-radius: 8px;
  background-color: #000;
  position: relative;
  cursor: pointer;

  img {
    width: 16vw;
    object-fit: cover;
    opacity: 0.04;
  }
  &-data {
    color: #fff;
  }
}
</style>

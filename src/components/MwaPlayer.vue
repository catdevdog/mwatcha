<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import { covertNum, timestampToFormat } from "@/store/index";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  video: {
    channelId: String,
    channelTitle: String,
    videoId: String,
    title: String,
    thumbnail: String,
    date: String,
    description: String,
    commentCount: Number,
    viewCount: Number,
    likeCount: Number,
    favoriteCount: Number,
  },
  size: String,
});

onMounted(() => {
  // console.log(props.video);
});
const goVideo = () => {
  router.push(`/video/${props.video.videoId}`);
};

const thumbnail = computed(() => {
  return (
    props.video.thumbnail.maxres?.url ??
    props.video.thumbnail.medium?.url ??
    props.video.thumbnail.high?.url
  );
});
</script>
<template>
  <div :class="['player', `player-${size}`]" @click="goVideo">
    <img :src="thumbnail" alt="" />
    <div class="dimmed"></div>
  </div>
  <div class="player-data">
    <p :class="`title ${size}`">
      <span>{{ video.title }}</span>
    </p>
    <p class="date-count">
      {{ timestampToFormat(video.date) }} <em>•</em> 조회수
      {{ covertNum(video.viewCount) }}회
    </p>
  </div>
</template>
<style lang="scss">
.player {
  overflow: hidden;
  border-radius: 5px;
  background-color: #000;
  position: relative;
  cursor: pointer;
  max-height: 160px;

  img {
    transition: 0.3s;
    width: 100%;
    object-fit: cover;
    // opacity: 0.04;
  }
  &:hover img {
    transform: translate(-5%, -5%);
    width: 110%;
    transition: 0.3s;
  }

  @media (max-width: 1280px) {
    max-height: none;
    &:hover img {
      transform: none;
      width: 100%;
    }
  }
  &-data {
    margin-top: 6px;
    color: #fff;
    .title {
      font-size: 16px;
    }
    .date-count {
      margin-top: 4px;
      font-size: 14px;
      em {
        color: #777;
        font-size: 12px;
      }
    }
  }
}
</style>

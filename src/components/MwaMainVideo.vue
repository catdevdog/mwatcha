<script setup>
import { onMounted, ref, defineProps, computed } from "vue";
import { covertNum, timestampToFormat } from "@/store/index";
import { getClassifiedVideos } from "@/api/inquiry";

const props = defineProps({
  playlist: Array,
});

const playlist = computed(() => {
  let plays = [];
  props.playlist.forEach((ch) => {
    plays = [...plays, ...ch.playList];
  });
  return plays.map((pl) => pl.id);
});

const loadComplete = ref(false);
const latestVideo = ref({});

onMounted(async () => {
  const { resultVideos, nextStart } = await getClassifiedVideos(
    playlist.value,
    1,
    ["date", "desc"]
  );

  latestVideo.value = resultVideos[0];
  loadComplete.value = true;
});
</script>
<template>
  <div class="main" v-if="loadComplete">
    <router-link :to="`/video/${latestVideo.videoId}`">
      <iframe
        :src="`https://www.youtube.com/embed/${latestVideo.videoId}?autoplay=1&mute=1&controls=0&loop=1&rel=0&vq=hd1080`"
        frameborder="0"
        allowfullscreen
      ></iframe>
      <div class="main-info">
        <span class="channel-title">[ {{ latestVideo.channelTitle }} ]</span>
        <p class="title">{{ latestVideo.title }}</p>
        <p class="date-count">
          {{ timestampToFormat(latestVideo.date) }} <em>•</em> 조회수
          {{ covertNum(latestVideo.viewCount) }}회<em>•</em> 마뫄 3 채널 영상 중
          가장 최신 영상이 표시됩니다!
        </p>
      </div>
      <div class="main-dimmed"></div>
    </router-link>
  </div>
</template>
<style lang="scss">
.main {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  position: relative;
  margin-bottom: 72px;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &-info {
    position: absolute;
    bottom: 72px;
    left: 48px;
    z-index: 3;

    .channel-title {
      font-size: 26px;
    }
    .title {
      margin-top: 8px;
      font-family: "TheJamsil3Regular";
      font-size: 60px;
    }
    .date-count {
      margin-top: 4px;
      color: #eaeaea;
      em {
        color: #777;
        font-size: 12px;
        margin: 0 4px;
      }
    }

    @media (max-width: 1280px) {
      position: absolute;
      bottom: 12px;
      left: 8px;
      width: 100%;
      z-index: 3;

      .channel-title {
        font-size: 14px;
      }
      .title {
        margin-top: 4px;
        font-family: "TheJamsil3Regular";
        font-size: 18px;
      }
      .date-count {
        font-size: 12px;
        margin-top: 4px;
        color: #eaeaea;
        em {
          color: #777;
          font-size: 12px;
          margin: 0 2px;
        }
      }
    }
  }

  &-dimmed {
    background: linear-gradient(
      0deg,
      rgba(17, 17, 17, 1) 5%,
      rgba(17, 17, 17, 0.8701855742296919) 35%,
      rgba(255, 255, 255, 0) 100%
    );
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>

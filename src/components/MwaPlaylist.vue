<script setup>
import { getClassifiedVideos } from "@/api/inquiry";
import { initFirebase } from "@/firebase";
import "swiper/css";
import { FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { defineProps, onMounted, ref } from "vue";
import MwaPlayer from "./MwaPlayer.vue";

const props = defineProps({
  title: String,
  playlist: Array,
  infinite: Boolean,
  description: String,
  size: String,
  initCount: Number,
});

const { db } = initFirebase();
const isMount = ref(false);

const videos = ref([]); // 페이지에 표시할 비디오들을 담을 배열

const reachEnd = async (swiper) => {
  if (swiper.isEnd && isMount.value && props.infinite) {
    // // 딜레이 추가
    // await new Promise((resolve) => setTimeout(resolve, 500)); // 1초 딜레이 (1000ms)
    // const lastDoc = await loadNextPage(lastVisible.value);
    // lastVisible.value = lastDoc;
  }
};
onMounted(async () => {
  isMount.value = true;
  const { resultVideos, nextStart } = await getClassifiedVideos(
    props.playlist,
    5,
    ["date", "desc"]
  );
  videos.value = resultVideos;
  // console.log(videos.value);
});
</script>
<!--  -->
<template>
  <div class="playlist" v-if="playlist">
    <div class="playlist-title">
      <span v-if="description">{{ description }}</span>
    </div>
    <div class="playlist-wrap">
      <swiper
        :slides-per-view="4.4"
        :modules="[FreeMode, Pagination]"
        :space-between="8"
        :freeMode="true"
        :pagination="{
          clickable: true,
        }"
        @reachEnd="reachEnd"
      >
        <swiper-slide v-for="video in videos" :key="video.id">
          <div class="playlist-player">
            <mwa-player :video="video" :size="size" />
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playlist {
  &-title {
    font-family: "TheJamsil3Regular";
    font-size: 4vh;
    color: #fff;
    span {
      font-size: 2vh;
      white-space: nowrap;
    }
  }
  &-wrap {
    margin-top: 20px;
    // display: flex;
    justify-content: flex-start;
    gap: 20px;

    @media (min-width: 680px) {
      gap: 10px;
    }

    overflow-x: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}
</style>

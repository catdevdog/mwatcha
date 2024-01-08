<script setup>
import { getClassifiedVideos } from "@/api/inquiry";
import "swiper/css";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { defineProps, onMounted, ref } from "vue";
import MwaPlayer from "./MwaPlayer.vue";

const props = defineProps({
  title: String,
  playlist: Array,
  infinite: {
    type: Boolean,
    default: true,
  },
  description: String,
  size: String,
  initCount: Number,
});
const isMount = ref(false);
const next = ref(0);

const videos = ref([]); // 페이지에 표시할 비디오들을 담을 배열

const reachEnd = async (swiper) => {
  if (swiper.isEnd && isMount.value && props.infinite) {
    // // 딜레이 추가
    await new Promise((resolve) => setTimeout(resolve, 500));
    const { resultVideos, nextStart } = await getClassifiedVideos(
      props.playlist,
      8,
      ["date", "desc"],
      next.value,
      4
    );
    videos.value = [...videos.value, ...resultVideos];
    next.value = nextStart;
  }
};
onMounted(async () => {
  isMount.value = true;
  const { resultVideos, nextStart } = await getClassifiedVideos(
    props.playlist,
    8,
    ["date", "desc"]
  );
  videos.value = resultVideos;
  next.value = nextStart;
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
        :modules="[FreeMode, Pagination, Navigation]"
        :navigation="{
          nextEl: `.swiper-button-next-${playlist[0]}`,
          prevEl: `.swiper-button-prev-${playlist[0]}`,
        }"
        :space-between="8"
        :freeMode="true"
        :pagination="{
          clickable: true,
        }"
        @reachEnd="reachEnd"
        :breakpoints="{
          1280: { slidesPerView: 5.4 },
          768: { slidesPerView: 3.6 },
          360: { slidesPerView: 1.2 },
        }"
      >
        <swiper-slide v-for="video in videos" :key="video.id">
          <div class="playlist-player">
            <mwa-player :video="video" :size="size" />
          </div>
        </swiper-slide>
      </swiper>
      <div :class="`swiper-button-prev-${playlist[0]} nav prev`">◀</div>
      <div :class="`swiper-button-next-${playlist[0]} nav next`">▶</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.playlist {
  &-wrap {
    margin-top: 10px;
    position: relative;

    overflow-x: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    .nav {
      position: absolute;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #212121;
      border-radius: 20px;
      font-size: 10px;
      z-index: 3;
      top: calc((100% - 39px) / 2 - 25px);
      &.next {
        right: 10px;
      }
      &.prev {
        left: 10px;
      }
      opacity: 0.8;
    }
  }
}
</style>

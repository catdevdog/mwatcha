<script setup>
import { getClassifiedVideos } from "@/api/inquiry";
import "swiper/css";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { defineProps, onMounted, ref, computed } from "vue";
import MwaPlayer from "./MwaPlayer.vue";

const props = defineProps({
  playlist: Array,
});

const videos = ref([]); // 페이지에 표시할 비디오들을 담을 배열
const isMount = ref(false);
const next = ref(0);

const playlist = computed(() => {
  let plays = [];
  props.playlist.forEach((ch) => {
    plays = [...plays, ...ch.playList];
  });
  return plays.map((pl) => pl.id);
});

const filter = ref("viewCount");

const reachEnd = async (swiper) => {
  // if (swiper.isEnd && isMount.value && props.infinite) {
  //   // // 딜레이 추가
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   const { resultVideos, nextStart } = await getClassifiedVideos(
  //     props.playlist,
  //     8,
  //     ["date", "desc"],
  //     next.value,
  //     4
  //   );
  //   videos.value = [...videos.value, ...resultVideos];
  //   next.value = nextStart;
  // }
};

onMounted(async () => {
  isMount.value = true;
  const { resultVideos, nextStart } = await getClassifiedVideos(
    playlist.value,
    20,
    [filter.value, "desc"]
  );
  videos.value = resultVideos;
  console.log(videos.value);
  console.log(props.playlist);
});
</script>

<template>
  <div class="playlist" v-if="playlist">
    <div class="playlist-title">
      <img src="@/assets/logo_youtube_color.svg" alt="youtube" />조회 수 TOP 20!
      <p>
        모든 재생 목록을 기준으로 집계된 리스트로, 중복된 영상이 노출 될 수
        있습니다.
      </p>
    </div>
    <div class="playlist-wrap">
      <swiper
        :modules="[FreeMode, Pagination, Navigation]"
        :navigation="{
          nextEl: `.swiper-button-next-trend`,
          prevEl: `.swiper-button-prev-trend`,
        }"
        :space-between="100"
        :freeMode="true"
        :pagination="{
          clickable: true,
        }"
        loop
        @reachEnd="reachEnd"
        :breakpoints="{
          1280: { slidesPerView: 3.6 },
          768: { slidesPerView: 2.4 },
          360: { slidesPerView: 1.2 },
        }"
      >
        <swiper-slide v-for="(video, idx) in videos" :key="video.id">
          <div class="playlist-player">
            <p class="video-index">{{ idx + 1 }}</p>
            <mwa-player :video="video" size="large" />
          </div>
        </swiper-slide>
      </swiper>
      <div :class="`swiper-button-prev-trend nav prev`">◀</div>
      <div :class="`swiper-button-next-trend nav next`">▶</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.playlist {
  &-title {
    display: flex;
    align-items: center;
    font-size: 50px;
    margin-left: -88px;
    font-family: "Pretendard-Bold";
    margin-bottom: 20px;
    flex-wrap: wrap;
    p {
      font-family: "Pretendard-Light";
      font-size: 14px;
      margin-left: 12px;
      color: #ccc;
    }

    img {
      height: 80px;
      margin-right: 12px;
      @media (max-width: 1280px) {
        display: none;
      }
    }
  }
  &-wrap {
    margin-top: 10px;
    position: relative;
    .swiper {
      overflow: visible;
    }

    // overflow-x: auto;
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
        left: -100px;
      }
      opacity: 0.8;
    }
  }
  &-player {
    position: relative;
    .video-index {
      position: absolute;
      font-size: 180px;
      font-family: "Pretendard-ExtraBold";
      line-height: 150px;
      left: -70px;
      top: 60px;
      z-index: -1;
      color: #ffe1af;
      text-shadow: 5px 5px 0px #442b30;
      z-index: 1;
      font-style: italic;
      letter-spacing: -20px;
    }
  }
}
</style>

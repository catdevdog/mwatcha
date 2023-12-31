<script setup>
import { computed, defineProps, onMounted, ref } from "vue";
import MwaPlayer from "./MwaPlayer.vue";
import {
  doc,
  getDocs,
  collection,
  setDoc,
  orderBy,
  limit,
  startAfter,
  query,
  where,
} from "firebase/firestore";
import { initFirebase } from "@/firebase";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { FreeMode, Pagination } from "swiper/modules";

const props = defineProps({
  title: String,
  data: Array,
  infinite: Boolean,
  description: String,
  size: String,
  max: Number,
});

const { db } = initFirebase();
const isMount = ref(false);

const videos = ref([]); // 페이지에 표시할 비디오들을 담을 배열
const lastVisible = ref(null);

const loadNextPage = async (next, viewMore = 8) => {
  const playlistRef = collection(db, "VIDEOS");
  let q;

  if (props.data.length > 1) {
    // mixed playlist
    q = query(
      playlistRef,
      orderBy("viewCount", "desc"),
      ...(next ? [startAfter(next)] : []),
      limit(props.max ?? viewMore)
    );
  } else {
    const playlistIds = props.data.map((d) => d.id);
    q = query(
      playlistRef,
      where("playlistId", "in", playlistIds),
      orderBy("date", "desc"),
      ...(next ? [startAfter(next)] : []),
      limit(props.max ?? viewMore)
    );
  }

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    if (doc.data().title !== "Private video") videos.value.push(doc.data());
  });

  return querySnapshot.docs[querySnapshot.docs.length - 1];
};

const init = async () => {
  lastVisible.value = await loadNextPage(null); // 초기 페이지 로드
};

const onNext = async () => {
  const lastDoc = await loadNextPage(lastVisible.value);
  lastVisible.value = lastDoc;
};

const playlistMergeTitle = computed(() => {
  return props.data.map((pl) => pl.name).join(" +");
});

const perView = computed(() => {
  return props.size == "large" ? 1.6 : 5.2;
});

const reachEnd = async (swiper) => {
  if (swiper.isEnd && isMount.value && props.infinite) {
    // 딜레이 추가
    await new Promise((resolve) => setTimeout(resolve, 500)); // 1초 딜레이 (1000ms)
    const lastDoc = await loadNextPage(lastVisible.value);
    lastVisible.value = lastDoc;
  }
};
onMounted(async () => {
  await init();
  isMount.value = true;
});
</script>
<!--  -->
<template>
  <div class="playlist" v-if="data">
    <div class="playlist-title">
      {{ title ? title : playlistMergeTitle }}
      <span v-if="description">{{ description }}</span>
    </div>
    <div class="playlist-wrap">
      <swiper
        :slides-per-view="perView"
        :modules="[FreeMode, Pagination]"
        :space-between="8"
        :freeMode="true"
        :pagination="{
          clickable: true,
        }"
        @reachEnd="reachEnd"
        :breakpoints="{
          '768': {
            spaceBetween: 12,
          },
        }"
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

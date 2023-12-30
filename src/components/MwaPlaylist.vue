<script setup>
import { defineProps, onMounted, ref } from "vue";
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

const props = defineProps({
  data: {
    channel: String,
    channelId: String,
    count: Number,
    description: String,
    id: String,
    name: String,
    open: Boolean,
  },
});

const { db } = initFirebase();

const videos = ref([]); // 페이지에 표시할 비디오들을 담을 배열
const lastVisible = ref(null);

const loadNextPage = async (lastVisible) => {
  const playlistRef = collection(db, "VIDEOS");

  let q = query(
    playlistRef,
    where("playlistId", "==", props.data.id),
    orderBy("date", "desc"),
    limit(10)
  );

  if (lastVisible) {
    q = query(
      playlistRef,
      where("playlistId", "==", props.data.id),
      orderBy("date", "desc"),
      startAfter(lastVisible.value),
      limit(10)
    );
  }

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    if (doc.data().title !== "Private video") videos.value.push(doc.data());
  });

  // 페이지네이션을 위해 마지막으로 받아온 문서를 반환합니다.
  return querySnapshot.docs[querySnapshot.docs.length - 1];
};

const init = async () => {
  lastVisible.value = await loadNextPage(null); // 초기 페이지 로드
};

const onNext = async () => {
  const lastDoc = await loadNextPage(lastVisible);
  lastVisible.value = lastDoc;
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="playlist">
    <div class="playlist-title">
      {{ data.name }}
    </div>
    <div class="playlist-wrap">
      <div class="playlist-player" v-for="video in videos" :key="video.id">
        <mwa-player :video="video" />
      </div>
    </div>
    <button @click="onNext">더 보기</button>
    <!-- 페이지네이션을 위한 버튼 -->
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
    justify-content: flex-start;
    gap: 20px;
    overflow-x: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
}
</style>

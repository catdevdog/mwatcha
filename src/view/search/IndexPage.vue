<script setup>
import { getPlayList, getYouTubeDatas } from "@/api/index";
import MwaPlaylist from "@/components/MwaPlaylist.vue";
import { initFirebase } from "@/firebase";
import { compareTimestamps, getTimeDiffHour } from "@/store/index";
import { collection, getDocs } from "firebase/firestore";
import { onMounted, ref } from "vue";
import MwaMainVideo from "@/components/MwaMainVideo.vue";
import { useRoute, useRouter } from "vue-router";
import { getSearchVideos } from "@/api/inquiry";
import MwaPlayer from "@/components/MwaPlayer.vue";

const route = useRoute();
const router = useRouter();

const { db } = initFirebase();

const videoList = ref([]);
const searchValue = ref("");

onMounted(async () => {
  const { params } = useRoute();
  searchValue.value = params.search;
  const { resultVideos, nextStart } = await getSearchVideos(
    searchValue.value,
    20,
    ["date", "desc"]
  );

  // console.log(resultVideos);

  videoList.value = resultVideos;
});
</script>
<template>
  <div class="title">
    <p>"{{ searchValue }}" 검색 결과</p>
  </div>
  <div v-if="videoList.length">
    <div class="result">
      <div class="result-item" v-for="video in videoList" :key="video.id">
        <mwa-player :video="video" />
      </div>
    </div>
  </div>
  <div v-else>
    <div class="result-none">
      <p>검색 결과가 없습니다.</p>
      현재 검색 기능은 영상 제목 글자의 첫 부분을 기준으로 검색하며, 20건 까지
      검색합니다.<br />
      ex ) 검색어 '마뫄'<br />
      '마뫄' 바보 --- 검색 O<br />
      바보 '마뫄' --- 검색 X
    </div>
  </div>
</template>
<style lang="scss" scoped>
.title {
  padding: 36px 36px 0;
  font-size: 36px;
}
.result {
  padding: 36px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  &-item {
    flex: 0 0 calc(20% - (12px * 4) / 5);
    @media (max-width: 1280px) {
      flex: 0 0 calc(50% - (12px * 1) / 2);
    }
  }
  &-none {
    p {
      font-size: 100px;
    }
    padding: 36px;
    color: #666;
  }
}
</style>

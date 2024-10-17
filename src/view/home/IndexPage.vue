<script setup>
import { getPlayList, getYouTubeDatas } from "@/api/index";
import MwaPlaylist from "@/components/MwaPlaylist.vue";
import { initFirebase } from "@/firebase";
import { compareTimestamps, getTimeDiffHour } from "@/store/index";
import { collection, getDocs } from "firebase/firestore";
import { onMounted, ref } from "vue";
import MwaMainVideo from "@/components/MwaMainVideo.vue";
import TrendVideos from "@/components/TrendVideos.vue";
import { useStore } from "@/store/store";

// Firebase 초기화
const { db } = initFirebase();

// 반응형 데이터 정의
const channelList = ref([]); // 채널 목록을 저장할 배열
const playList = ref([]); // 모든 채널의 재생목록을 저장할 배열

const updateDelay = ref(1); // 업데이트 주기 (시간 단위)
const updateDate = ref(0); // 마지막 업데이트 날짜

// Pinia 스토어 인스턴스 생성
const store = useStore();

/**
 * 초기화 함수
 * Firestore에서 채널 데이터를 조회하고, 각 채널의 재생목록을 업데이트 또는 Firestore에서 사용
 */
const init = async () => {
  try {
    // Firestore에서 CHANNEL_ID 컬렉션 데이터 조회
    const docRef = collection(db, "CHANNEL_ID");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((item) => {
      channelList.value.push(item.data());
    });

    // 각 채널의 재생목록 조회 및 업데이트
    for (const ch of channelList.value) {
      if (compareTimestamps(ch.lastUpdateDt, Date.now(), updateDelay.value)) {
        // 업데이트 주기 내에 업데이트되지 않은 경우 YouTube 데이터 조회 및 Firestore 업데이트
        await getYouTubeDatas(ch.id);
      } else {
        // 업데이트 주기 내에 업데이트된 경우 Firestore 데이터 사용
        updateDate.value = ch.lastUpdateDt;
        console.log(
          `${ch.name} 채널 - ${updateDelay.value}시간 내 업데이트 기록이 있습니다.`
        );
      }
    }
  } catch (error) {
    console.error("초기화 중 오류 발생:", error);
  }
};

// 컴포넌트가 마운트될 때 초기화 및 데이터 수집 수행
onMounted(async () => {
  await init();

  // 각 채널의 재생목록을 조회하여 playList에 저장
  playList.value = await Promise.all(
    channelList.value.map(async (channel) => {
      return {
        ...channel,
        playList: await getPlayList(channel.id),
      };
    })
  );
});
</script>

<template>
  <div v-if="playList.length" style="color: #fff">
    <!-- 메인 - 모든 채널의 재생목록 -->
    <div class="main-video">
      <mwa-main-video :playlist="playList" />
    </div>
    <div class="trend-video">
      <trend-videos :playlist="playList" />
    </div>
    <!-- 각 채널의 재생목록을 렌더링 -->
    <div
      class="channel"
      v-for="channel in playList"
      :key="channel.id"
      :id="channel.id"
    >
      <div class="channel-title">
        <img src="@/assets/logo_youtube_color.svg" alt="youtube" />
        <p>{{ channel.name }}</p>
      </div>
      <div class="channel-content">
        <div
          class="playlist"
          v-for="list in channel.playList"
          :key="list.id"
          :id="list.id"
        >
          <p class="playlist-title">
            {{ list.snippet.title }}
          </p>
          <div class="playlist-content">
            <mwa-playlist :playlist="[list.id]" />
          </div>
          <template v-if="list.length"> </template>
        </div>
      </div>
    </div>
    <!-- 업데이트 정보 (주석 처리) -->
    <!-- <p class="update">
      최근 업데이트 약 {{ getTimeDiffHour(updateDate) }}시간 전 / 현재
      {{ updateDelay }}시간을 주기로 업데이트 합니다.
    </p> -->
  </div>
</template>

<style lang="scss" scoped>
.trend-video {
  padding: 0 0 0 120px;
  overflow: hidden;
  margin-top: 32px;
}

.channel {
  padding-top: 72px;
  padding-left: 20px;
  &-title {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 12px;
    margin-bottom: 12px;

    img {
      height: 46px;
    }
    p {
      font-size: 36px;
      font-family: "Pretendard-Bold";
    }
    margin-bottom: 4px;
  }
  &-content {
    padding-left: 12px;
    @media (max-width: 1280px) {
      padding: 0px;
    }
  }
  .playlist {
    margin-bottom: 18px;
    &-title {
      font-size: 20px;
    }
  }
}
button {
  padding: 24px;
  color: #333;
  cursor: pointer;
  background-color: #fff;
}
.update {
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  z-index: 3;
}
</style>

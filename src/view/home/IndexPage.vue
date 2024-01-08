<script setup>
import { getPlayList, getYouTubeDatas } from "@/api/index";
import MwaPlaylist from "@/components/MwaPlaylist.vue";
import { initFirebase } from "@/firebase";
import { compareTimestamps, getTimeDiffHour } from "@/store/index";
import { collection, getDocs } from "firebase/firestore";
import { onMounted, ref } from "vue";
import MwaMainVideo from "@/components/MwaMainVideo.vue";
import TrendVideos from "@/components/TrendVideos.vue";

const { db } = initFirebase();

const channelList = ref([]);
const playList = ref([]);

const updateDelay = ref(1); // 업데이트 주기 (hour)
const updateDate = ref(0);

/**
 *
    {name: '1분 마뫄', id: 'UC5rZJy3Neujs6jQPtZdFZlQ'}
    {name: '마뫄', id: 'UCgEo04TieA9BEmiDOhYQUGw'}
 */

const init = async () => {
  // 첫 진입 시 채널 데이터 조회
  const docRef = collection(db, "CHANNEL_ID");
  const docSnap = await getDocs(docRef);
  docSnap.forEach((item) => {
    channelList.value.push(item.data());
  });

  // 각 채널 재생 목록 조회 후 재생목록 디비에 입력
  channelList.value.forEach(async (ch) => {
    if (compareTimestamps(ch.lastUpdateDt, +new Date(), updateDelay.value)) {
      // 업데이트 기록이 기준보다 오래된 경우 데이터 조회
      await getYouTubeDatas(ch.id);
    } else {
      // 아닌 경우 DB 사용
      updateDate.value = ch.lastUpdateDt;
      console.log(
        `${ch.name} 채널 - ${updateDelay.value}시간 내 업데이트 기록이 있습니다.`
      );
    }
  });
};

onMounted(async () => {
  await init();

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
    <!-- 메인 - 모든 채널의 재생목록  -->
    <div class="main-video">
      <mwa-main-video :playlist="playList" />
    </div>
    <div class="trend-video">
      <trend-videos :playlist="playList" />
    </div>
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
  padding-top: 56px;
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

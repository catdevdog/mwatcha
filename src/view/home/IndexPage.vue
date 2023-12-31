<script setup>
import { onMounted, ref } from "vue";
import { getChannelPlaylists, getChannelVideos } from "@/api/index";
import {
  doc,
  getDocs,
  collection,
  setDoc,
  orderBy,
  limit,
  startAfter,
  query,
  updateDoc,
} from "firebase/firestore";
import { initFirebase } from "@/firebase";
import MwaPlaylist from "@/components/MwaPlaylist.vue";
import { compareTimestamps, getTimeDiffHour } from "@/store/index";

const { db } = initFirebase();
// .doc("bucket_item").update({ name: 'duck2' });

const channelList = ref([]);
const playList = ref([]);
const updateDelay = ref(24);
const updateDate = ref(0);

/**
 *
    {name: '1분 마뫄', id: 'UC5rZJy3Neujs6jQPtZdFZlQ'}
    {name: '마뫄', id: 'UCgEo04TieA9BEmiDOhYQUGw'}
 */

const init = async () => {
  const docRef = collection(db, "CHANNEL_ID");
  const docSnap = await getDocs(docRef);
  docSnap.forEach((item) => {
    channelList.value.push(item.data());
  });

  const playListRef = collection(db, "PLAYLIST");
  const playListSnap = await getDocs(playListRef);

  playListSnap.forEach((item) => {
    if (item.data().open) playList.value.push(item.data());
  });
  await onGetPlayList();
};

const onUpdateDt = async (channel) => {
  await updateDoc(doc(db, "CHANNEL_ID", channel.id), {
    lastUpdateDt: +new Date(),
  });
};

const onGetPlayList = async () => {
  channelList.value.forEach(async (channel) => {
    const param = {
      part: "snippet",
      channelId: channel.id,
      maxResults: 20,
    };

    // 페이지 진입 시 channel 컬렉션에 lastUpdateDt 값 조회 후 현재 시스템 시각과 비교 > 6시간 이상 차이나면 false
    // -> 조회 완료 후 update값 true로 변경
    if (
      compareTimestamps(channel.lastUpdateDt, +new Date(), updateDelay.value)
    ) {
      // updateDelay보다 큰 경우(업데이트 필요 한 경우)
      onSetPlayListData(playList.value, channel);
      console.log("조회 완료");
    } else {
      updateDate.value = channel.lastUpdateDt;
      console.log(
        `${channel.name} 채널 - 마지막 업데이트 ${new Date(
          channel.lastUpdateDt
        )}`
      );
      console.log(
        `${channel.name} 채널 - ${updateDelay.value}시간 내 업데이트 기록이 있습니다.`
      );
    }
  });
};

const onSetPlayListData = async (list, channel) => {
  onUpdateDt(channel); // 채널 업데이트
  list.forEach(async (playList) => {
    const param = {
      part: "snippet,contentDetails",
      playlistId: playList.id,
      maxResults: 50,
    };

    const videos = [];
    const result = await getChannelVideos(param);
    // console.log(result);

    result.forEach((video) => {
      if (Object.keys(video).length) {
        videos.push({
          channel: channel.name,
          channelId: channel.id,
          playlistId: video.snippet.playlistId,
          title: video.snippet.title,
          id: video.snippet.resourceId.videoId,
          thumbnail:
            video.snippet.thumbnails?.maxres?.url ??
            video.snippet.thumbnails?.standard?.url ??
            "",
          date: video.snippet.publishedAt,
          ...video.detail,
        });
      }
    });
    // 플레이리스트 컬렉션에 추가
    await setDoc(doc(db, "PLAYLIST", playList.id), {
      channel: channel.name,
      channelId: channel.id,
      count: videos.length,
      id: playList.id,
      name: playList.name,
      description: playList.description,
      open: channel.open,
    });

    await onSetVideos(videos); // 비디오 컬렉션에 추가
  });
};

const onSetVideos = async (videos) => {
  videos.forEach(async (video) => {
    await setDoc(doc(db, "VIDEOS", video.id), {
      ...video,
      viewCount: Number(video.viewCount),
    });
  });
};

onMounted(async () => {
  await init();
});
</script>
<template>
  <div>
    <div class="playlist" v-if="playList.length">
      <mwa-playlist
        title="🌻인기 마뫄🌼"
        :data="playList"
        description="1분 마뫄 채널 조회수 TOP 10 !"
        size="large"
        :max="10"
      />
    </div>
    <div class="playlist" v-for="list in playList" :key="list.id">
      <mwa-playlist
        :data="[list]"
        infinite
        size="medium"
        description="재생목록 최신 영상"
      />
    </div>
    <p class="update">
      최근 업데이트 약 {{ getTimeDiffHour(updateDate) }}시간 전
    </p>
  </div>
</template>
<style lang="scss" scoped>
.playlist {
  margin-bottom: 30px;
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

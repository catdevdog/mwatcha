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
} from "firebase/firestore";
import { initFirebase } from "@/firebase";
import MwaPlaylist from "@/components/MwaPlaylist.vue";

const { db } = initFirebase();
// .doc("bucket_item").update({ name: 'duck2' });

const channelList = ref([]);
const playList = ref([]);
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
};

const onGetPlayList = async () => {
  channelList.value.forEach(async (channel) => {
    const param = {
      part: "snippet",
      channelId: channel.id,
      maxResults: 20,
    };
    console.log(channel.update);
    if (!channel.update) {
      console.log(channel.update);
      const playList = await getChannelPlaylists(param);
      onSetPlayListData(playList, channel);
    } else {
      // 페이지 진입 시 channel 컬렉션에 lastUpdateDt 값 조회 후 현재 시스템 시각과 비교 > 6시간 이상 차이나면 false
      // -> 조회 완료 후 update값 true로 변경
      console.log("업데이트 완료");
    }
  });
};

const onSetPlayListData = async (list, channel) => {
  list.forEach(async (playList) => {
    const param = {
      part: "snippet",
      playlistId: playList.id,
      maxResults: 50,
    };

    const videos = [];
    const result = await getChannelVideos(param);
    console.log(result);

    result.forEach((video) => {
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
        description: playList.snippet.localized.description,
      });
    });
    await setDoc(doc(db, "PLAYLIST", playList.id), {
      channel: channel.name,
      channelId: channel.id,
      count: videos.length,
      id: playList.id,
      name: playList.snippet.localized.title,
      description: playList.snippet.localized.description,
      open: channel.open,
    });

    await onSetVideos(videos); // 비디오 컬렉션에 추가
  });
};

const onSetVideos = async (videos) => {
  videos.forEach(async (video) => {
    await setDoc(doc(db, "VIDEOS", video.id), {
      ...video,
      view: 0,
    });
  });
};

onMounted(async () => {
  await init();
});
</script>
<template>
  <div>
    <button @click="onGetPlayList">get</button>
  </div>
  <div>
    {{ playList.description }}
    <div class="playlist" v-for="list in playList" :key="list.id">
      <mwa-playlist :data="list" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.playlist {
  margin-bottom: 40px;
}
button {
  padding: 24px;
  color: #333;
  cursor: pointer;
  background-color: #fff;
}
</style>

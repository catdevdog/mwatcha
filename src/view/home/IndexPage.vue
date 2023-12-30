<script setup>
import { onMounted, ref } from "vue";
import { getChannelPlaylists, getChannelVideos } from "@/api/index";
import { doc, getDocs, collection, setDoc } from "firebase/firestore";
import { initFirebase } from "@/firebase";
import MwaPlaylist from "@/components/MwaPlaylist.vue";

const { db } = initFirebase();
// .doc("bucket_item").update({ name: 'duck2' });

const channelList = ref([]);
/**
 * 
    {name: '1분 마뫄', id: 'UC5rZJy3Neujs6jQPtZdFZlQ'}
    {name: '마뫄', id: 'UCgEo04TieA9BEmiDOhYQUGw'}
 */

const playList = ref([]);

const init = async () => {
  const docRef = collection(db, "CHANNEL_ID");
  const docSnap = await getDocs(docRef);

  docSnap.forEach((item) => {
    channelList.value.push(item.data());
  });
  console.log(channelList.value);

  const playListRef = collection(db, "PLAYLIST");
  const playListSnap = await getDocs(playListRef);

  playListSnap.forEach((item) => {
    if (item.data().open) playList.value.push(item.data());
  });

  console.log(playList.value);
};

const onGetPlayList = async () => {
  channelList.value.forEach(async (channel) => {
    const param = {
      part: "snippet",
      channelId: channel.id,
      maxResults: 20,
    };
    if (!channel.update) {
      const playList = await getChannelPlaylists(param);
      console.log(channel.update);
      onSetPlayListData(playList, channel.name, channel.open);
    } else {
      // 페이지 진입 시 channel 컬렉션에 lastUpdateDt 값 조회 후 현재 시스템 시각과 비교 > 6시간 이상 차이나면 false
      // -> 조회 완료 후 update값 true로 변경
      console.log("업데이트 완료");
    }
  });
};

const onSetPlayListData = async (list, name, openValue) => {
  list.forEach(async (playList) => {
    const param = {
      part: "snippet",
      playlistId: playList.id,
      maxResults: 30,
    };
    const videos = [];
    const result = await getChannelVideos(param);

    result.forEach((video) => {
      videos.push({
        title: video.snippet.title,
        id: video.snippet.resourceId.videoId,
        thumbnail:
          video.snippet.thumbnails.maxres?.url ??
          video.snippet.thumbnails.standard.url,
      });
    });
    await setDoc(doc(db, "PLAYLIST", playList.id), {
      channel: name,
      count: videos.length,
      id: playList.id,
      name: playList.snippet.localized.title,
      description: playList.snippet.localized.description,
      open: openValue,
      videos: videos,
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
    <mwa-playlist v-for="list in playList" :key="list.id" :data="list" />
  </div>
</template>
<style lang="scss">
button {
  padding: 24px;
  color: #333;
  cursor: pointer;
  background-color: #fff;
}
</style>

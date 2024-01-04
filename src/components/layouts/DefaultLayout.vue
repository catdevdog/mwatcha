<script setup>
import { getPlayList } from "@/api/index";
import { initFirebase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onMounted, ref } from "vue";

const { db } = initFirebase();

const channelList = ref([]);
const playList = ref([]);

onMounted(async () => {
  // TODO: 데이터 중복 호출 문제 해소, store
  const docRef = collection(db, "CHANNEL_ID");
  const docSnap = await getDocs(docRef);

  docSnap.forEach((item) => {
    channelList.value.push(item.data());
  });

  playList.value = await Promise.all(
    channelList.value.map(async (channel) => {
      return {
        ...channel,
        playList: await getPlayList(channel.id),
        toggle: true,
      };
    })
  );
  console.log(playList.value);
});
</script>
<template>
  <div class="layout">
    <div class="header" style="color: #fff">
      <!-- <p>24.01.01 업데이트 내용</p>
      <br />
      <p>- '마뫄' 채널 api 오픈</p>
      <p>- 모든 재생목록 연결</p>
      <p>- 모바일 1차 대응</p>
      <p>- 기타 코드 최적화 + 디자인 변경</p> -->
    </div>
    <div class="nav">
      <div class="logo">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <div class="menu">
        <div class="menu-channel" v-for="ch in playList" :key="ch.id">
          <p class="menu-title" @click="ch.toggle = !ch.toggle">
            <a :href="`#${ch.id}`">{{ ch.name }}</a>
          </p>
          <ul v-if="ch.toggle">
            <li class="menu-playlist" v-for="pl in ch.playList" :key="pl.id">
              - <a :href="`#${pl.id}`">{{ pl.snippet.title }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="update">
        24.01.04 - 업데이트 내용
        <ul>
          <li>- PC 로고 추가</li>
          <li>- 죄송합니다. 디자인 할 줄 모릅니다.</li>
          <li>- PC 네비게이션 추가</li>
          <li>catdevdog@gmail.com</li>
        </ul>
      </div>
    </div>
    <router-view />
    <div class="footer" style="color: #fff"></div>
  </div>
</template>
<style lang="scss" scoped>
.menu {
  margin-top: 30px;
  &-channel {
    margin-bottom: 18px;
  }
  &-title {
    font-size: 20px;
    a {
      font-family: "TheJamsil3Regular";
    }
  }
  &-playlist {
    padding-left: 8px;
    margin-top: 8px;
    color: #eaeaea;
    white-space: nowrap;
    a {
      font-size: 14px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.layout {
  padding: 0 0 0 300px;

  @media (max-width: 1280px) {
    padding: 0px;
  }
  .header {
    // height: 400px;
  }
  .footer {
    // padding-top: 100px;
  }
  .nav {
    position: fixed;
    color: #fff;
    top: 0;
    left: 0;
    bottom: 0;
    border-right: 1px #1b1c1d solid;
    background-color: #111;

    width: 300px;
    padding: 0 15px;

    img {
      width: 100%;
    }

    @media (max-width: 1280px) {
      display: none;
    }
  }
  .update {
    font-size: 12px;
    position: absolute;
    bottom: 0;
  }
}
</style>

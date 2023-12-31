<script setup>
import { getPlayList } from "@/api/index";
import { getSearchVideos } from "@/api/inquiry";
import { initFirebase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { db } = initFirebase();

const channelList = ref([]);
const playList = ref([]);
const selectedChannelId = ref("");
const selectedChannelPlaylist = ref([]);

const searchValue = ref("");
const isSearch = ref(false);

const onClickChannel = (ch) => {
  if (route.name !== "/") router.push("/");
  selectedChannelId.value = ch.id;
  selectedChannelPlaylist.value = ch.playList;
};

const onSearch = async () => {
  await router.push(`/result/${searchValue.value}`);
  location.reload();
};

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
        toggle: false,
      };
    })
  );
});
</script>
<template>
  <div class="layout">
    <div class="header">
      <div class="search-wrap" v-if="isSearch">
        <label for="search">
          <input
            type="text"
            v-model="searchValue"
            id="search"
            placeholder="키워드 검색"
            @keydown.enter="onSearch"
          />
          <button @click="onSearch">
            <img src="@/assets/icon-search.svg" alt="" />
          </button>
        </label>
        <span>BETA</span>
      </div>
      <router-link to="/mamwa"> 젠장 또 마뫄야.. </router-link>
    </div>
    <div class="nav">
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/logo.png" alt="" />
        </router-link>
      </div>
      <div class="menu">
        <div class="menu-channel">
          <button class="menu-title" @click="isSearch = !isSearch">
            <img src="@/assets/icon-search.svg" alt="" />
            <p>찾기</p>
          </button>
        </div>
      </div>
      <hr />
      <div class="menu">
        <div class="menu-channel" v-for="ch in playList" :key="ch.id">
          <a class="menu-title" :href="`#${ch.id}`" @click="onClickChannel(ch)">
            <img src="@/assets/LOGO_YT.svg" alt="youtube" />
            <p>{{ ch.name }}</p>
          </a>
        </div>
      </div>
      <hr />
      <div class="menu-playlist" v-if="selectedChannelPlaylist.length">
        <ul>
          <li
            class="playlist"
            v-for="pl in selectedChannelPlaylist"
            :key="pl.id"
          >
            <img src="@/assets/icon-playlist.svg" alt="youtube" />
            <a :href="`#${pl.id}`">{{ pl.snippet.title }}</a>
          </li>
        </ul>
      </div>
      <div class="developer">catdevdog@gmail.com</div>
    </div>
    <router-view />
    <div class="footer" style="color: #fff"></div>
  </div>
</template>
<style lang="scss" scoped>
.header {
  padding: 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .search-wrap {
    label {
      display: inline-flex;
      align-items: center;
      background: rgb(34, 35, 38);
      padding: 6px 12px;
      border-radius: 6px;
      overflow: hidden;
      input {
        flex: 1 0 auto;
        background: transparent;
        color: #fff;
        padding: 0px;
        border: 0px;
        outline: none;
        margin: 0px;
        appearance: none;
        caret-color: #997000;
        font-size: 15px;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 20px;
      }
      button {
        cursor: pointer;
      }
    }
    span {
      display: inline-block;
      padding: 6px 8px;
      background: rgb(34, 35, 38);
      margin-left: 8px;
      color: #fff;
      border-radius: 6px;
      font-size: 12px;
      font-family: "Pretendard-Thin";
      letter-spacing: 0.5px;
    }
  }
}

.menu {
  margin-top: 20px;
  &-channel {
    margin-bottom: 6px;
  }
  &-title {
    font-size: 15px;
    padding: 8px 8px;
    border-radius: 6px;
    font-family: "Pretendard-Light";
    display: block;
    width: 100%;
    transition: 0.1s;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: #fff;

    &:hover {
      transition: 0.1s;
      background-color: #303133;
    }
    img {
      width: 22px;
    }
  }
  &-playlist {
    max-height: calc(100vh - 350px);
    overflow-y: auto;
    .playlist {
      padding-left: 8px;
      margin-bottom: 12px;
      color: #eaeaea;
      white-space: nowrap;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-family: "Pretendard-Light";
      color: #999;

      &:hover {
        transition: 0.1s;
        color: #fff;
      }
      a {
        flex: 1 1 auto;
        white-space: normal;
      }
      img {
        width: 20px;
      }
    }
  }
}

.layout {
  padding: 56px 0 0 240px;

  @media (max-width: 1280px) {
    padding: 56px 0px 0;
  }
  .header {
    position: fixed;
    top: 0;
    left: 240px;
    right: 0;
    height: 56px;
    background-color: #111;
    z-index: 13;

    @media (max-width: 1280px) {
      left: 0px;
    }
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

    width: 240px;
    padding: 0 16px;

    .logo {
      padding: 8px;
      img {
        width: 120px;
      }
    }

    @media (max-width: 1280px) {
      display: none;
    }
  }
  .developer {
    font-size: 14px;
    position: absolute;
    bottom: 20px;
    font-family: "Pretendard-Thin";
    text-align: center;
    width: auto;
    color: #666;
  }
}
</style>

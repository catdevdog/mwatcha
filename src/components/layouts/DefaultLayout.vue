<script setup>
import { getPlayList } from "@/api/index";
import { getSearchVideos } from "@/api/inquiry";
import { initFirebase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onMounted, ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/store.js";

const route = useRoute();
const router = useRouter();
const store = useStore();

const { db } = initFirebase();

const channelList = ref([]);
const playList = ref([]);
const selectedChannelId = ref("");
const selectedChannelPlaylist = ref([]);

const searchValue = ref("");
const isSearch = ref(true);

const onClickChannel = (ch) => {
  if (route.name !== "/") router.push("/");
  selectedChannelId.value = ch.id;
  selectedChannelPlaylist.value = ch.playList;
  store.setCurrentChannel(ch.id);
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
  if (route.hash && channelList.value.find((ch) => ch.id === route.hash)) {
    const hash = route.hash.replace("#", "");
    store.setCurrentChannel(hash);
    selectedChannelId.value = hash;
    if (playList.value.find((ch) => ch.id === hash)) {
      selectedChannelPlaylist.value = playList.value.find(
        (ch) => ch.id === hash
      ).playList;
      store.setCurrentPlaylist(selectedChannelPlaylist.value[0]);
    }
  }
});

onBeforeMount(() => {
  window.addEventListener("hashchange", function () {
    const hash = window.location.hash;
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        // 기본 브라우저의 해시 스크롤 동작 방지
        event.preventDefault();

        // 원하는 Y 값으로 스크롤 (예: 현재 위치보다 100px 위로 조정)
        const yOffset = -140; // Y 오프셋 (원하는 값으로 변경 가능)
        const y =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  });
});
</script>
<template>
  <div class="layout">
    <div class="header">
      <div class="logo">
        <a href="/#home">
          <img src="@/assets/logo.png" alt="" />
        </a>
      </div>
      <div class="menu">
        <div
          :class="[
            'menu-channel',
            { active: ch.id === store.getCurrentChannel },
          ]"
          v-for="ch in playList"
          :key="ch.id"
        >
          <a class="menu-title" :href="`#${ch.id}`" @click="onClickChannel(ch)">
            <!-- <img src="@/assets/LOGO_YT.svg" alt="youtube" /> -->
            <p>{{ ch.name }}</p>
          </a>
        </div>
      </div>
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
      <!-- <router-link to="/mamwa"> 젠장 또 마뫄야.. </router-link> -->
    </div>
    <div class="article" id="home">
      <div class="playlist">
        <ul>
          <li
            :class="[
              'playlist',
              { active: pl.id === store.getCurrentPlaylist.id },
            ]"
            v-for="pl in selectedChannelPlaylist"
            :key="pl.id"
          >
            <a :href="`#${pl.id}`" @click="store.setCurrentPlaylist(pl)">{{
              pl.snippet.title
            }}</a>
          </li>
        </ul>
      </div>
      <router-view />
    </div>
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
    @media screen and (max-width: 1280px) {
      display: none;
    }
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

// 1680px 이하에서는 풀로, 1680px이상에서는 1680px로 고정
.article {
  width: 1680px;
  margin: 0 auto;
  @media (max-width: 1920px) {
    width: 100%;
    padding: 0px 32px;
  }

  .playlist {
    position: sticky;
    top: 72px;
    z-index: 10;
    background-color: #000;

    ul {
      display: flex;
      gap: 8px;
      width: 100%;
      overflow-x: auto;
      padding-top: 10px;
      padding-bottom: 16px;

      //scrollbar
      // -ms-overflow-style: none; /* IE and Edge */
      // scrollbar-width: none; /* Firefox */
      // &::-webkit-scrollbar {
      //   display: none; /* Chrome, Safari, Opera*/
      // }

      li {
        white-space: nowrap;
        border-radius: 100px;
        border: 2px solid #2e2e2e;
        color: #848484;
        padding: 8px 16px;
        background-color: #000;
        font-size: 14px;

        a {
          line-height: 1.5;
        }

        &.active {
          background-color: #fff;
          color: #000;
          border: 2px solid #fff;
          font-family: "Pretendard-Bold";
        }
      }
    }
  }
}

.menu {
  margin-left: 20px;
  flex: 1 1 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;

  &-channel {
    // margin-bottom: 6px;
    &.active {
      .menu-title {
        color: #fff;
        border-bottom: 2px solid #fff;
      }
    }
  }
  &-title {
    font-size: 16px;
    padding: 16px 16px;
    font-family: "Pretendard-Light";
    display: block;
    width: 100%;
    transition: 0.1s;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: #848484;

    &:hover {
      transition: 0.1s;
      border-bottom: 2px solid #848484;
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
  padding: 72px 0 0 0px;

  @media (max-width: 1280px) {
    padding: 72px 0px 0;
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    padding: 12px 40px;
    background-color: #000;
    z-index: 13;

    .logo {
      img {
        width: 116px;
      }
    }

    @media (max-width: 1280px) {
      left: 0px;
    }
  }
  .footer {
    padding-top: 100px;
  }
  .nav {
    position: fixed;
    color: #fff;
    top: 72px;
    left: 0;
    bottom: 0;
    border-right: 1px #1b1c1d solid;
    background-color: #000;

    width: 240px;
    padding: 0 16px;

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

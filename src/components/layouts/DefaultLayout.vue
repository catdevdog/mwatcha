<script setup>
import { getPlayList } from "@/api/index";
import { initFirebase } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onMounted, ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/store.js";

// Constants
const SCROLL_Y_OFFSET = -140;

// Composables
const route = useRoute();
const router = useRouter();
const store = useStore();
const { db } = initFirebase();

// State
const channelList = ref([]);
const playList = ref([]);
const selectedChannelId = ref("");
const selectedChannelPlaylist = ref([]);
const searchValue = ref("");
const isSearch = ref(true);

// Methods
const handleChannelClick = async (channel) => {
  if (route.name !== "/") {
    await router.push("/");
  }

  selectedChannelId.value = channel.id;
  selectedChannelPlaylist.value = channel.playList;
  store.setCurrentChannel(channel.id);
};

const handleSearch = async () => {
  if (!searchValue.value.trim()) return;

  await router.push(`/result/${searchValue.value}`);
  location.reload();
};

const initializeChannels = async () => {
  const docRef = collection(db, "CHANNEL_ID");
  const docSnap = await getDocs(docRef);

  channelList.value = docSnap.docs.map((doc) => doc.data());

  playList.value = await Promise.all(
    channelList.value.map(async (channel) => ({
      ...channel,
      playList: await getPlayList(channel.id),
      toggle: false,
    }))
  );
};

const handleInitialRoute = () => {
  if (!route.hash || route.hash === "#home") return;

  const hash = route.hash.replace("#", "");
  store.setCurrentChannel(hash);
  selectedChannelId.value = hash;

  const selectedChannel = playList.value.find((ch) => ch.id === hash);
  if (selectedChannel) {
    selectedChannelPlaylist.value = selectedChannel.playList;
    store.setCurrentPlaylist(selectedChannelPlaylist.value[0]);
  }
};

const setupScrollHandler = () => {
  window.addEventListener("hashchange", (event) => {
    const hash = window.location.hash;
    if (!hash) return;

    const targetElement = document.querySelector(hash);
    if (!targetElement) return;

    event.preventDefault();

    const y =
      targetElement.getBoundingClientRect().top +
      window.pageYOffset +
      SCROLL_Y_OFFSET;

    window.scrollTo({ top: y, behavior: "smooth" });
  });
};

// Lifecycle Hooks
onMounted(async () => {
  await initializeChannels();
  handleInitialRoute();
});

onBeforeMount(() => {
  setupScrollHandler();
});
</script>

<template>
  <div class="layout">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <a href="/#home">
          <img src="@/assets/logo.png" alt="Logo" />
        </a>
      </div>

      <!-- Navigation Menu -->
      <nav class="menu">
        <div
          v-for="channel in playList"
          :key="channel.id"
          :class="[
            'menu-channel',
            { active: channel.id === store.getCurrentChannel },
          ]"
        >
          <a
            class="menu-title"
            :href="`#${channel.id}`"
            @click="handleChannelClick(channel)"
          >
            <p>{{ channel.name }}</p>
          </a>
        </div>
      </nav>

      <!-- Search Bar -->
      <div v-if="isSearch" class="search-wrap">
        <label for="search">
          <input
            type="text"
            v-model="searchValue"
            id="search"
            placeholder="키워드 검색"
            @keydown.enter="handleSearch"
          />
          <button @click="handleSearch">
            <img src="@/assets/icon-search.svg" alt="Search" />
          </button>
        </label>
        <span class="beta-tag">BETA</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="article" id="home">
      <nav class="playlist">
        <ul>
          <li
            v-for="playlist in selectedChannelPlaylist"
            :key="playlist.id"
            :class="[
              'playlist-item',
              { active: playlist.id === store.getCurrentPlaylist?.id },
            ]"
          >
            <a
              :href="`#${playlist.id}`"
              @click="store.setCurrentPlaylist(playlist)"
            >
              {{ playlist.snippet.title }}
            </a>
          </li>
        </ul>
      </nav>

      <router-view />
    </main>

    <footer class="footer" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  padding: 72px 0 0;

  @media (max-width: 1280px) {
    padding: 72px 0 0;
  }
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  padding: 0 36px;
  background-color: #000;
  z-index: 13;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1280px) {
    left: 0;
    padding: 0;
  }

  .logo img {
    width: 116px;
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
    &.active .menu-title {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }

  &-title {
    font-size: 16px;
    padding: 16px;
    font-family: "Pretendard-Light";
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: #848484;
    transition: border-bottom 0.1s;

    &:hover {
      border-bottom: 2px solid #848484;
    }
  }
}

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

    input {
      flex: 1 0 auto;
      background: transparent;
      color: #fff;
      padding: 0;
      border: 0;
      outline: none;
      caret-color: #997000;
      font-size: 15px;
      line-height: 20px;
    }

    button {
      cursor: pointer;
    }
  }

  .beta-tag {
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

.article {
  width: 1680px;
  margin: 0 auto;

  @media (max-width: 1920px) {
    width: 100%;
    padding: 0;
  }

  .playlist {
    position: sticky;
    top: 70px;
    z-index: 10;
    background-color: #000;

    ul {
      display: flex;
      gap: 8px;
      width: 100%;
      overflow-x: auto;
      padding: 10px 0 16px;
    }

    &-item {
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
        border-color: #fff;
        font-family: "Pretendard-Bold";
      }
    }
  }
}

.footer {
  padding-top: 100px;
}
</style>

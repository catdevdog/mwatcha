<script setup>
import { defineProps, onMounted, ref } from "vue";
import { covertNum } from "@/store/index";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  video: {
    channel: String,
    channelId: String,
    id: String,
    title: String,
    thumbnail: String,
    date: String,
    description: String,
    detail: () => {},
  },
  size: String,
});

onMounted(() => {
  // console.log(props.video);
});
const goVideo = () => {
  router.push(`/video/${props.video.id}`);
};
</script>
<template>
  <div :class="['player', `player-${size}`]" @click="goVideo">
    <img :src="video.thumbnail" alt="" />
    <div class="dimmed"></div>
    <div class="player-data">
      <p :class="`title ${size}`">
        <span>{{ video.title }}</span>
      </p>
      <!-- <p class="date">{{ video.date }}</p> -->
      <p :class="`count ${size}`">조회수 {{ covertNum(video.viewCount) }}회</p>
    </div>
  </div>
</template>
<style lang="scss">
.player {
  overflow: hidden;
  border-radius: 8px;
  background-color: #000;
  position: relative;
  cursor: pointer;

  img {
    width: 16vw;
    object-fit: cover;
    // opacity: 0.02;
  }
  &-large {
    img {
      width: 53vw;
    }
  }

  .dimmed {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    background-color: #000;
    transition: 0.3s;
  }
  &:hover {
    .dimmed {
      opacity: 0.9;
      transition: 0.15s;
    }
  }
  &-data {
    bottom: -80px;
    position: absolute;
    margin-top: 8px;
    color: #fff;
    transition: 0.3s;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .title {
      max-width: 65%;
      overflow: hidden;
      text-overflow: ellipsis;
      span {
        font-family: "TheJamsil3Regular";
        font-size: 40px;
        white-space: nowrap;
      }
      &.medium {
        span {
          font-size: 16px;
        }
      }

      &:hover {
        span {
          white-space: wrap;
        }
      }
    }
    .count {
      color: #fff;
      font-size: 40px;
      &.medium {
        font-size: 14px;
      }
    }
  }

  .player-data {
    bottom: 20px;
    margin-top: 8px;
    color: #fff;
    transition: 0.3s;
  }
  &:hover {
  }
}
</style>

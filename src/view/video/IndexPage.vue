<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

const { params } = useRoute();

const videoId = ref("");

onMounted(() => {
  videoId.value = params.videoId;
});
</script>
<template>
  <div class="video">
    <iframe
      :src="`https://www.youtube.com/embed/${videoId}`"
      frameborder="0"
      allowfullscreen
    ></iframe>
  </div>
</template>
<style lang="scss" scoped>
.video {
  width: 100%;
  height: 100vh;
  position: relative;
  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>

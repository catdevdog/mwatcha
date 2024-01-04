import { timestampToFormat } from '@/store'; import { timestampToFormat } from
'@/store';

<script setup>
import { liveOnDate } from "@/store/data";
import { onMounted } from "vue";
import Chart from "chart.js/auto";

onMounted(async () => {});
</script>
<template>
  <div style="width: 800px"><canvas id="acquisitions"></canvas></div>
</template>
<style lang="scss" scoped>
* {
  color: #fff;
}
</style>

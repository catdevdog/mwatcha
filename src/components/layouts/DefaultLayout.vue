<script setup></script>
<template>
  <div class="layout">
    <div class="header" style="color: #fff"></div>
    <router-view />
    <div class="footer" style="color: #fff">catdevdog@gmail.com</div>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  padding: 40px 0 0 240px;

  @media (max-width: 1280px) {
    padding: 20px;
  }
  .header {
    height: 400px;
  }
  .footer {
    padding-top: 400px;
  }
}
</style>

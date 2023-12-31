<script setup></script>
<template>
  <div class="layout">
    <div class="header">header</div>
    <router-view />
    <div class="footer">footer</div>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  padding: 40px 0 0 280px;

  @media (max-width: 768px) {
    padding: 20px;
  }
  .header {
    height: 400px;
  }
  .footer {
    height: 400px;
  }
}
</style>

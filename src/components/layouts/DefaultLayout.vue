<script setup></script>
<template>
  <div class="layout">
    <div class="header" style="color: #fff">
      <p>24.01.01 업데이트 내용</p>
      <br />
      <p>- '마뫄' 채널 api 오픈</p>
      <p>- 모든 재생목록 연결</p>
      <p>- 모바일 1차 대응</p>
      <p>- 기타 코드 최적화 + 디자인 변경</p>
    </div>
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

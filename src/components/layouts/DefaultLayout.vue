<script setup></script>
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
      24.01.03 - 업데이트 내용
      <ul>
        <li>- 메인 상단에 가장 최신 영상 노출</li>
        <li>- 마뫄의 직박구리 채널 api 연결</li>
        <li>- 6시간 마다 모든 채널 업데이트 됩니다.</li>
      </ul>
    </div>
    <router-view />
    <div class="footer" style="color: #fff">catdevdog@gmail.com</div>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  padding: 0 0 0 280px;

  @media (max-width: 1280px) {
    padding: 0px;
  }
  .header {
    // height: 400px;
  }
  .footer {
    padding-top: 400px;
  }
  .nav {
    position: fixed;
    color: #fff;
    top: 0;
    left: 0;

    width: 280px;
    height: 200px;
    padding: 12px;
    @media (max-width: 1280px) {
      display: none;
    }
  }
}
</style>

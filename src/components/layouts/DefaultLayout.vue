<script setup></script>
<template>
  <div class="layout">
    <div class="header" style="color: #fff">
      (가칭)뫗챠 - Mwatcha
      <br />
      <br />
      ott플랫폼 스타일로 개발 중입니다. 23.12.29 ~ 진행 중
      <br />
      <br />
      방문자 증가로 서버 문제가 생길 수 있어서 1분 마뫄 데이터만 호출
      하고있습니다.
      <br />
      <br />
      유튜브 api를 이용해 마뫄, 1분 마뫄, 마뫄 다시보기 채널의 재생목록 영상들을
      불러오는 서비스입니다.
      <br />
      <br />
      <p>수요가 높은지 확인하기 위해 가오픈했습니다. 모바일은 죄송합니다 ㅠ</p>
    </div>
    <router-view />
    <div class="footer" style="color: #fff">catdevdog@gmail.com</div>
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

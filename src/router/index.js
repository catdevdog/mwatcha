import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/components/layouts/DefaultLayout.vue"),
      meta: {
        title: "뫗챠!",
        description: "마뫄 유튜브 영상 모아보기",
      },
      children: [
        // main
        {
          path: "/",
          name: "/home",
          component: () => import("@/view/home/IndexPage.vue"),
          meta: {
            title: "뫗챠!",
            description: "마뫄 유튜브 영상 모아보기",
          },
        },
        {
          path: "/video/:videoId",
          name: "/video",
          component: () => import("@/view/video/IndexPage.vue"),
          meta: {
            title: "뫗챠!",
            description: "마뫄 유튜브 영상 모아보기",
          },
        },
        {
          path: "/result/:search",
          name: "/result",
          component: () => import("@/view/search/IndexPage.vue"),
          meta: {
            title: "뫗챠!",
            description: "마뫄 유튜브 영상 모아보기",
          },
        },
        {
          path: "/mamwa",
          name: "/mamwa",
          component: () => import("@/view/mamwa/IndexPage.vue"),
          meta: {
            title: "뫗챠!",
            description: "마뫄 유튜브 영상 모아보기",
          },
        },
        {
          path: "/dev-page",
          name: "/dev",
          component: () => import("@/view/dev/IndexPage.vue"),
          meta: {
            title: "뫗챠!",
            description: "마뫄 유튜브 영상 모아보기",
          },
        },
      ],
    },
    {
      path: "/",
      children: [],
    },
  ],
});

router.afterEach((to, from) => {
  const title = to.meta.title || "뫗챠!";
  if (title) document.title = title;
});
export default router;

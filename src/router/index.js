import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/components/layouts/DefaultLayout.vue"),
      children: [
        // main
        {
          path: "/",
          name: "/home",
          component: () => import("@/view/home/IndexPage.vue"),
        },
        {
          path: "/dev-page",
          name: "/dev",
          component: () => import("@/view/dev/IndexPage.vue"),
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "/video/:videoId",
          name: "/video",
          component: () => import("@/view/video/IndexPage.vue"),
        },
      ],
    },
  ],
});

router.afterEach((to, from) => {
  const title = to.meta.title || "뫗챠!";
  if (title) document.title = title;
});
export default router;

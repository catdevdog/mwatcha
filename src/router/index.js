import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      // component: () => import('@/components/layouts/Login/LoginLayout.vue'),
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
  ],
});

export default router;

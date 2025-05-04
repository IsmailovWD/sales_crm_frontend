import { createRouter, createWebHistory } from "vue-router";
import { useMessage } from "naive-ui";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: () => import("@/components/layouts/default.vue"),
      redirect: { name: "dashboard" },
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          meta: { keepAlive: true },
          component: () => import("@/views/dashboard/Index.vue"),
        },
        {
          path: "information",
          name: "information",
          component: () => import("@/views/information/Index.vue"),
          redirect: { name: "products" },
          children: [
            {
              path: "products",
              name: "products",
              component: () => import("@/views/information/products/Index.vue"),
            },
            {
              path: "users",
              name: "users",
              component: () => import("@/views/information/users/Index.vue"),
            },
            {
              path: "regions",
              name: "regions",
              component: () => import("@/views/information/regions/Index.vue"),
            },
            {
              path: ":region_id/districts",
              name: "districts",
              component: () =>
                import("@/views/information/districts/Index.vue"),
            },
            {
              path: "clients",
              name: "clients",
              component: () =>
                import("@/views/information/contacts/clients/Index.vue"),
            },
            {
              path: "suppliers",
              name: "suppliers",
              component: () =>
                import("@/views/information/contacts/suppliers/Index.vue"),
            },
            {
              path: "delivery-man",
              name: "delivery-man",
              component: () =>
                import("@/views/information/delivery-man/Index.vue"),
            },
          ],
        },
        {
          path: "crm",
          name: "crm",
          component: () => import("@/views/crm/Index.vue"),
          redirect: { name: "crm-deal" },
          children: [
            {
              path: "deal",
              name: "crm-deal",
              // component: () => import("@/views/crm/deal/Tabs.vue"),
              redirect: {
                name: "crm-deal-tabs",
                params: { dealTab: "kanban" },
              },
              children: [
                {
                  path: ":dealTab",
                  name: "crm-deal-tabs",
                  component: () => import("@/views/crm/deal/Tabs.vue"),
                  children: [
                    {
                      path: "detail/:deal_id",
                      name: "crm-deal-detail",
                      component: () => import("@/views/crm/deal/Detail.vue"),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("@/views/singIn/Index.vue"),
    },
    // {
    //   path: '/:catchAll(.*)',
    //   redirect: `/${DEFAULT_THEME}/${DEFAULT_LANG}/dashboard`,
    // },
  ],
});

router.onError((to, from, next) => {
  const message = useMessage();
  message.error("Route not found");
});

export default router;

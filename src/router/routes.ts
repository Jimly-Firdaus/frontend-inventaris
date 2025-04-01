import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // owner role route
      {
        name: "OwnerDashboardPage",
        path: "/dashboard",
        component: () => import("pages/Owner/DashboardPage.vue"),
      },
      {
        name: "ManageStoresPage",
        path: "/manage/stores",
        component: () => import("pages/Owner/ManageStoresPage.vue"),
      },
      {
        name: "TransactionsPage",
        path: "/transactions",
        component: () => import("pages/Owner/TransactionsPage.vue"),
      },

      // warehouse manager route
      {
        name: "ManageProductsPage",
        path: "/manage/products",
        component: () => import("pages/Owner/ManageProductsPage.vue"),
      },

      // store manager route
      {
        name: "ManagePurchasePage",
        path: "/manage/purchase",
        component: () => import("pages/Owner/ManagePurchasePage.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/NoLoginLayout.vue"),
    children: [
      {
        name: "LoginPage",
        path: "/login",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

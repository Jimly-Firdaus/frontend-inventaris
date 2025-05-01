import { USER_ROLE } from "src/constants/user";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // owner role route
      {
        name: "ManageStoresPage",
        path: "/manage/stores",
        meta: {
          role: [USER_ROLE.OWNER, USER_ROLE.STORE_MANAGER],
        },
        component: () => import("pages/Owner/ManageStoresPage.vue"),
      },
      {
        name: "TransactionsPage",
        path: "/transactions",
        meta: {
          role: [USER_ROLE.OWNER],
        },
        component: () => import("pages/Owner/TransactionsPage.vue"),
      },
      {
        name: "ManageWarehouseAccountPage",
        path: "/manage/warehouse-account",
        meta: {
          role: [USER_ROLE.OWNER],
        },
        component: () => import("pages/Owner/ManageWarehouseAccountPage.vue"),
      },
      {
        name: "InsightPage",
        path: "/insight",
        meta: {
          role: [USER_ROLE.OWNER],
        },
        component: () => import("pages/Owner/InsightPage.vue"),
      },

      // warehouse manager route
      {
        name: "ManageProductsPage",
        path: "/manage/products",
        meta: {
          role: [USER_ROLE.OWNER, USER_ROLE.WAREHOUSE_MANAGER],
        },
        component: () => import("pages/ManageProductsPage.vue"),
      },
      {
        name: "OutboundPage",
        path: "/outbounds",
        meta: {
          role: [USER_ROLE.WAREHOUSE_MANAGER],
        },
        component: () => import("pages/WarehouseManager/OutboundPage.vue"),
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

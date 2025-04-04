import { USER_ROLE } from "src/constants/user";
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
        meta: {
          role: [USER_ROLE.OWNER, USER_ROLE.STORE_MANAGER]
        },
        component: () => import("pages/Owner/ManageStoresPage.vue"),
      },
      {
        name: "TransactionsPage",
        path: "/transactions",
        meta: {
          role: [USER_ROLE.OWNER]
        },
        component: () => import("pages/Owner/TransactionsPage.vue"),
      },
      {
        name: "ManageWarehouseAccountPage",
        path: "/manage/warehouse-account",
        meta: {
          role: [USER_ROLE.OWNER]
        },
        component: () => import("pages/Owner/ManageWarehouseAccountPage.vue"),
      },

      // warehouse manager route
      {
        name: "ManageProductsPage",
        path: "/manage/products",
        meta: {
          role: [USER_ROLE.OWNER, USER_ROLE.WAREHOUSE_MANAGER]
        },
        component: () => import("pages/ManageProductsPage.vue"),
      },

      // store manager route
      {
        name: "ManagePurchasePage",
        path: "/manage/purchase",
        component: () => import("pages/StoreManager/ManagePurchasePage.vue"),
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

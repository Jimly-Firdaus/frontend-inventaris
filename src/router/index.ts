import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useStore } from "src/stores";
import { USER_ROLE } from 'src/constants/user';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      const store = useStore();
      if (!store.auth.user) {
        next("/login");
      } else {
        // Check if the user has the required role
        const userRole = store.auth.userRole;
        const requiredRole = to.meta.role as string[];
        if (userRole && !requiredRole.includes(userRole)) {
          // Redirect to a default page if the user does not have the required role
          if (userRole == USER_ROLE.OWNER) {
            next({ name: "TransactionsPage" });
          } else if (userRole == USER_ROLE.WAREHOUSE_MANAGER) {
            next({ name: "ManageProductsPage" });
          } else if (userRole == USER_ROLE.STORE_MANAGER) {
            next({ name: "ManageStoresPage" });
          }
        }
      }
    } else {
      next();
    }
  });

  return Router;
});

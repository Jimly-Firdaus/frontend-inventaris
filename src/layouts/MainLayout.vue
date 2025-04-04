<script setup lang="ts">
import { ref } from "vue";
import { TABS_AVAILABLE_BY_USER_ROLE } from "src/constants/user";
import { useStore } from "src/stores";
import { useRouter, useRoute } from "vue-router";
import { USER_ROLE } from "src/constants/user";

const store = useStore();
const router = useRouter();
const route = useRoute();
const leftDrawerOpen = ref(false);
const currentActiveTab = ref(1);

const currentTabs = computed(() =>
  store.auth.user ? TABS_AVAILABLE_BY_USER_ROLE[store.auth.user.role] : [],
);

const onGoToPage = async (pageName: string, activeTab: number) => {
  currentActiveTab.value = activeTab;
  await router.push({ name: pageName });
};

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const updateDrawerActiveTab = () => {
  if (store.auth.user) {
    const activeIdx = currentTabs.value.findIndex(
      (t) => t.routeName == route.name,
    );
    currentActiveTab.value = activeIdx + 1;
  }
};

const logout = async () => {
  store.auth.logout();
  await router.push({ name: "LoginPage" });
  window.location.reload();
};

watch(() => route.name, updateDrawerActiveTab);

onMounted(async () => {
  if (!store.auth.user) await router.push({ name: "LoginPage" });
  else {
    if (store.auth.user && route.path == "/") {
      switch (store.auth.user.role) {
        case USER_ROLE.OWNER:
          await router.push({ name: "TransactionsPage" });
          break;
        case USER_ROLE.WAREHOUSE_MANAGER:
          await router.push({ name: "ManageProductsPage" });
          break;
        case USER_ROLE.STORE_MANAGER:
          await router.push({ name: "ManageStoresPage" });
          break;
      }
    }
  }
  updateDrawerActiveTab();
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-2">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          color="primary"
        />
        <q-space />
        <q-btn
          flat
          dense
          no-caps
          icon="logout"
          aria-label="logout"
          @click="logout"
          label="Log Out"
          color="primary"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list class="tw-mt-24">
        <q-item-label
          v-for="(tabData, idx) in currentTabs"
          header
          :key="idx"
          @click="onGoToPage(tabData.routeName, tabData.id)"
          class="tw-cursor-pointer"
          :class="
            currentActiveTab == tabData.id
              ? 'bg-primary text-white'
              : 'text-grey-10'
          "
        >
          <p
            class="tw-mb-0 text-body-large"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >
            {{ tabData.tabLabel }}
          </p>
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

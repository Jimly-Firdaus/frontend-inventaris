<script setup lang="ts">
import { useStore } from "src/stores";
// import type { GetAllStoresQuery } from "src/stores/store/types";
import AddNewUserAccountModal from "src/components/Modal/AddNewUserAccountModal.vue";
// import { useRoute } from "vue-router";
import BackButton from "src/components/Button/BackButton.vue";
import UserDataTable from "src/components/Table/UserDataTable.vue";
import { USER_ROLE } from "src/constants/user";
import AddNewOutboundModal from "src/components/Modal/AddNewOutboundModal.vue";
import OutboundTable from "src/components/Table/OutboundTable.vue";
import type { GetAllOutboundsQuery } from "src/stores/product/types";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { useRouter } from "vue-router";
import StoreInsight from "src/components/Store/StoreInsight.vue";

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const store = useStore();
const router = useRouter();
const outbounds = computed(() => {
  if (store.auth.userRole == USER_ROLE.OWNER)
    return (
      store.products.outbounds?.filter(
        (o) => o.store_name == props.storeName,
      ) ?? []
    );
  else return store.products.outbounds ?? [];
});

const storeManagers = computed(() => store.auth.storeManagers[props.storeId]);

const usernameFilter = ref("");

const filteredStoreManagers = computed(() => {
  if (usernameFilter.value.length > 0)
    return (
      storeManagers.value?.filter((sm) =>
        sm.username.includes(usernameFilter.value),
      ) ?? []
    );
  else return storeManagers.value ?? [];
});

const showConfirmationModal = ref(false);
const showAddNewStoreManagerModal = ref(false);
const showAddNewOutboundModal = ref(false);

const page = ref(1);

const currentTab = ref("user");

const onConfirmDeleteStore = async () => {
  try {
    await store.stores.deleteStore(props.storeId);
    await router.replace({ query: {} });

    $q.notify({
      message: "Berhasil menghapus toko!",
      color: "primary",
      classes: "q-notify-font",
    });
  } catch (err) {
    console.error(err);
    $q.notify({
      message: "Terjadi kesalahan saat menghapus toko.",
      color: "negative",
      classes: "q-notify-font",
    });
  }
};

const refreshData = async () => {
  const req: GetAllOutboundsQuery = {
    page: page.value,
    limit: 10,
  };
  if (props.storeId) {
    req.store_id = props.storeId;
  }
  await store.products.getAllOutbounds(req);
};

watch(page, async () => {
  await refreshData();
});

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  if (!storeManagers.value && store.auth.userRole == USER_ROLE.OWNER)
    await store.auth.getAllStoreUsers(props.storeId);
  else currentTab.value = "outbound"

  const req: GetAllOutboundsQuery = {
    page: 1,
    limit: 10,
  };
  if (props.storeId) {
    req.store_id = props.storeId;
  }
  await store.products.getAllOutbounds(req);

  await store.products.getAllProducts();
  $q.loading.hide();
});
</script>
<template>
  <div>
    <template v-if="store.auth.userRole == USER_ROLE.OWNER">
      <BackButton is-remove-route-query />
      <div class="tw-flex tw-w-full tw-items-center tw-mt-4">
        <span
          class="text-grey-10 tw-font-bold"
          :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
          >Detail Informasi {{ storeName }}</span
        >
        <q-space />
        <q-btn
          unelevated
          no-caps
          label="Hapus"
          color="negative"
          @click="showConfirmationModal = true"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
        />
      </div>
      <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

      <q-tabs
        v-if="store.auth.userRole == USER_ROLE.OWNER"
        v-model="currentTab"
        align="left"
        class="tw-my-4"
      >
        <q-tab no-caps class="tab-content" name="user" label="User" />
        <q-tab no-caps class="tab-content" name="outbound" label="Penjualan" />
        <q-tab
          no-caps
          class="tab-content"
          name="insight"
          label="Insight"
        />
      </q-tabs>

      <q-card v-if="currentTab == 'user'" flat bordered class="tw-border-2 card-container">
        <div class="tw-flex tw-items-center tw-p-4">
          <span
            class="text-grey-10 tw-font-bold text-body-large"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
            >Informasi User Toko</span
          >
          <q-space />
          <q-btn
            no-caps
            :label="$q.screen.lt.sm ? '' : 'Tambah User'"
            icon="add"
            @click="showAddNewStoreManagerModal = true"
            :size="$q.screen.lt.sm ? 'md' : 'lg'"
            class="tw-rounded-3xl"
            color="primary"
          />
        </div>
        <q-input
          v-model="usernameFilter"
          outlined
          label="Cari Username"
          class="tw-mt-4 text-body-medium tw-px-2"
          :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
        />

        <UserDataTable :user-data="filteredStoreManagers" />
      </q-card>
    </template>

    <q-card v-if="currentTab == 'outbound'" flat bordered class="tw-border-2 tw-mt-8 tw-pb-2 card-container">
      <div
        class="tw-flex tw-items-center tw-p-4"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-2' : 'tw-mb-4'"
      >
        <span
          class="text-grey-10 tw-font-bold text-body-large"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >Informasi Transaksi Toko</span
        >
        <q-space />
        <q-btn
          no-caps
          :label="$q.screen.lt.sm ? '' : 'Tambah Transaksi'"
          icon="add"
          @click="showAddNewOutboundModal = true"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-3xl"
          color="primary"
        />
      </div>

      <OutboundTable
        :outbounds="outbounds"
        :total-pages="store.products.outboundsMeta?.total_page ?? 0"
        :total-data="store.products.outboundsMeta?.total_item ?? 0"
        :rows-per-page="10"
        v-model="page"
        :is-editable="store.auth.userRole == USER_ROLE.OWNER"
      />
    </q-card>

    <StoreInsight v-if="currentTab == 'insight'" :store-id="props.storeId" />

    <AddNewUserAccountModal
      v-if="showAddNewStoreManagerModal"
      v-model="showAddNewStoreManagerModal"
      :user-role="USER_ROLE.STORE_MANAGER"
      :store-id="props.storeId"
      :store-name="props.storeName"
    />
    <AddNewOutboundModal
      v-model="showAddNewOutboundModal"
      :store-id="props.storeId"
      :store-name="props.storeName"
    />
    <ConfirmationModal
      copy-text="Apakah Anda yakin ingin menghapus toko ini?"
      v-model="showConfirmationModal"
      is-warning
      @continue="onConfirmDeleteStore"
    />
  </div>
</template>
<style scoped lang="scss">
.tab-content {
  :deep(.q-tab__label) {
    font-size: 20px;
    line-height: 24px;
    @media (max-width: 600px) {
      font-size: 18px;
      line-height: 20px;
    }
  }
}
.card-container {
  border-color: $grey-6;
  border-radius: 24px;
}
</style>

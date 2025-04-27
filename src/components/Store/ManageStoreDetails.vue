<script setup lang="ts">
import { useStore } from "src/stores";
import AddNewUserAccountModal from "src/components/Modal/AddNewUserAccountModal.vue";
import BackButton from "src/components/Button/BackButton.vue";
import UserDataTable from "src/components/Table/UserDataTable.vue";
import { USER_ROLE } from "src/constants/user";
import AddInvoiceModal from "src/components/Modal/AddInvoiceModal.vue";
import SalesTable from "src/components/Table/SalesTable.vue";
import StoreProductsTable from "src/components/Table/StoreProductsTable.vue";
import type { GetAllProductsQuery } from "src/stores/product/types";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { useRouter } from "vue-router";
import StoreInsight from "src/components/Store/StoreInsight.vue";
import { AxiosError } from "axios";
import BaseCalendar from "src/components/BaseComponents/BaseCalendar.vue";
import { DateTime } from "luxon";
import type { GetAllInvoicesQuery } from "src/stores/store/types";

const props = defineProps({
  storeId: {
    type: String,
  },
  storeName: {
    type: String,
  },
});

const $q = useQuasar();
const store = useStore();
const router = useRouter();

const invoices = computed(() => store.stores.invoices);

const storeManagers = computed(
  () => store.auth.storeManagers[props.storeId ?? ""],
);

const storeProducts = computed(() => store.stores.storeProducts);

const filter = ref({
  username: "",
  customerName: "",
  productName: "",
});

const selectedTimeframe = ref("");

const filteredStoreManagers = computed(() => {
  if (filter.value.username.length > 0)
    return (
      storeManagers.value?.filter((sm) =>
        sm.username.includes(filter.value.username),
      ) ?? []
    );
  else return storeManagers.value ?? [];
});

const showConfirmationModal = ref(false);
const showAddNewStoreManagerModal = ref(false);
const showAddInvoiceModal = ref(false);

const page = ref({
  salesPage: 1,
  productsPage: 1,
});

const currentTab = ref("user");

const onConfirmDeleteStore = async () => {
  try {
    if (props.storeId) {
      await store.stores.deleteStore(props.storeId);
      await router.replace({ query: {} });

      $q.notify({
        message: "Berhasil menghapus toko!",
        color: "primary",
        classes: "q-notify-font",
      });
    }
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat menghapus toko: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat menghapus toko: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  }
};

const refreshData = async () => {
  if (currentTab.value == "products") {
    const req: GetAllProductsQuery = {
      name: filter.value.productName,
      page: page.value.productsPage,
      limit: 10,
    };
    if (props.storeId) {
      req.store_id = props.storeId;
      await store.stores.getAllStoreProducts(req);
    }
  }
};

watch(
  [() => filter.value.productName, () => page.value.productsPage],
  async () => {
    await refreshData();
  },
  { deep: true },
);

watch([() => filter.value.customerName, () => page.value.salesPage, selectedTimeframe], async () => {
  let req: GetAllInvoicesQuery = {
    store_id: store.auth.user?.store_id ?? props.storeId ?? "",
    page: page.value.salesPage,
    limit: 10,
    order_by: "created_at",
    asc: false,
    customer: filter.value.customerName,
  };
  if (selectedTimeframe.value) {
    const customDates = selectedTimeframe.value.split(" - ");
    if (customDates[0] && customDates[1]) {
      const customStart = DateTime.fromFormat(
        customDates[0].trim(),
        "dd LLL, yyyy",
      ).toISO();
      const customEnd = DateTime.fromFormat(
        customDates[1].trim(),
        "dd LLL, yyyy",
      ).toISO();

      req = {
        ...req,
        created_at_gte: customStart!,
        created_at_lte: customEnd!,
      };
    }
  }
  await store.stores.getAllInvoices(req);
});

watch(currentTab, async () => {
  if (currentTab.value == "products") {
    await refreshData();
  }
})

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  if (
    !storeManagers.value &&
    store.auth.userRole == USER_ROLE.OWNER &&
    props.storeId
  )
    await store.auth.getAllStoreUsers(props.storeId);
  else currentTab.value = "sales";

  const req: GetAllProductsQuery = {
    page: 1,
    limit: 10,
  };
  if (props.storeId) {
    req.store_id = props.storeId;
    await store.stores.getAllStoreProducts(req);
  }

  const invoiceReq: GetAllInvoicesQuery = {
    page: 1,
    limit: 10,
    order_by: "created_at",
    asc: false,
    store_id: store.auth.user?.store_id ?? props.storeId ?? "",
  };
  await store.stores.getAllInvoices(invoiceReq);

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
        <q-tab no-caps class="tab-content" name="sales" label="Penjualan" />
        <q-tab no-caps class="tab-content" name="products" label="Barang" />
        <q-tab no-caps class="tab-content" name="insight" label="Insight" />
      </q-tabs>

      <q-card
        v-if="currentTab == 'user'"
        flat
        bordered
        class="tw-border-2 card-container"
      >
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
          v-model="filter.username"
          outlined
          label="Cari Username"
          class="tw-mt-4 text-body-medium tw-px-2"
          :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
        />

        <UserDataTable :user-data="filteredStoreManagers" />
      </q-card>
    </template>

    <q-card
      v-if="currentTab == 'sales'"
      flat
      bordered
      class="tw-border-2 tw-mt-8 tw-pb-2 card-container"
    >
      <div
        class="tw-flex tw-items-center tw-p-4"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-2' : 'tw-mb-4'"
      >
        <span
          class="text-grey-10 tw-font-bold text-body-large"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >Informasi Penjualan Toko</span
        >
        <q-space />
        <q-btn
          no-caps
          :label="$q.screen.lt.sm ? '' : 'Tambah Invoice'"
          icon="add"
          @click="showAddInvoiceModal = true"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-3xl"
          color="primary"
        />
      </div>

      <div
        class="tw-my-4 tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-gap-x-4 tw-gap-y-4 tw-px-2"
      >
        <q-input
          v-model="filter.customerName"
          outlined
          label="Cari Nama Pembeli"
          class="text-body-medium tw-w-full tw-max-w-[500px]"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        />
        <BaseCalendar v-model:selected-timeframe="selectedTimeframe" />
      </div>

      <SalesTable
        :invoices="invoices"
        :total-pages="store.stores.invoicesMeta?.total_page ?? 0"
        :total-data="store.stores.invoicesMeta?.total_item ?? 0"
        :rows-per-page="10"
        v-model="page.salesPage"
      />
    </q-card>

    <q-card
      v-if="currentTab == 'products'"
      flat
      bordered
      class="tw-border-2 tw-mt-8 tw-pb-2 card-container"
    >
      <div
        class="tw-flex tw-items-center tw-p-4"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-2' : 'tw-mb-4'"
      >
        <span
          class="text-grey-10 tw-font-bold text-body-large"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >Informasi Barang dalam Toko</span
        >
        <q-space />
      </div>

      <q-input
        v-model="filter.productName"
        outlined
        label="Cari Barang"
        class="tw-mt-4 text-body-medium tw-px-2"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
      />
      <StoreProductsTable
        :products="storeProducts"
        :total-pages="store.stores.storeProductsMeta?.total_page ?? 0"
        :total-data="store.stores.storeProductsMeta?.total_item ?? 0"
        :rows-per-page="10"
        v-model="page.productsPage"
      />
    </q-card>

    <StoreInsight
      v-if="currentTab == 'insight' && props.storeId"
      :store-id="props.storeId"
    />

    <template v-if="props.storeId && props.storeName">
      <AddNewUserAccountModal
        v-if="showAddNewStoreManagerModal"
        v-model="showAddNewStoreManagerModal"
        :user-role="USER_ROLE.STORE_MANAGER"
        :store-id="props.storeId"
        :store-name="props.storeName"
      />
    </template>
    <AddInvoiceModal
      v-model="showAddInvoiceModal"
      :store-id="store.auth.user?.store_id ?? props.storeId ?? ''"
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

<script setup lang="ts">
import { useStore } from "src/stores";
// import { QTableProps } from "quasar";
import InboundTable from "src/components/Table/InboundTable.vue";
import OutboundTable from "src/components/Table/OutboundTable.vue";
import { USER_ROLE } from "src/constants/user";
import type {
  GetAllInboundsQuery,
  GetAllOutboundsQuery,
} from "src/stores/product/types";
import BaseCalendar from "src/components/BaseComponents/BaseCalendar.vue";
import { DateTime } from "luxon";
import {
  type PRODUCT_PRICE_TYPE,
  PRODUCT_PRICE_TYPE_LABEL,
} from "src/constants/price";

const $q = useQuasar();
const store = useStore();
const inbounds = computed(() => store.products.inbounds ?? []);
const outbounds = computed(() => store.products.outbounds ?? []);

const isLoading = ref(false);

const currentTab = ref("inbound");

const page = ref(1);

const priceTypeOpts = computed(() => [
  { value: "all", label: "Semua" },
  ...Object.entries(PRODUCT_PRICE_TYPE_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]);
const selectedPriceType = ref(priceTypeOpts.value[0]);

const productNameFilter = ref("");
const createdByFilter = ref("");
const selectedTimeframe = ref("");

const refreshData = async () => {
  isLoading.value = true;
  if (currentTab.value == "inbound") {
    const req: GetAllInboundsQuery = {
      page: page.value,
      limit: 10,
    };
    await store.products.getAllInbounds(req);
  } else {
    const req: GetAllOutboundsQuery = {
      page: page.value,
      limit: 10,
    };
    await store.products.getAllOutbounds(req);
  }
  isLoading.value = false;
};

watch(page, async () => {
  await refreshData();
});

watch(currentTab, async () => {
  page.value = 1;
  await refreshData();
});

watch(
  [
    selectedTimeframe,
    productNameFilter,
    createdByFilter,
    selectedPriceType,
    currentTab,
  ],
  async () => {
    isLoading.value = true;
    let req: GetAllInboundsQuery | GetAllOutboundsQuery = {
      page: page.value,
      limit: 10,
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
    if (productNameFilter.value.trim()) {
      req.product_name = productNameFilter.value.trim();
    }
    if (createdByFilter.value.trim()) {
      if (currentTab.value == "inbound")
        req.created_by_username = createdByFilter.value.trim();
      else req.store_name = createdByFilter.value.trim();
    }

    if (selectedPriceType.value && selectedPriceType.value.value != "all") {
      req.price_type = selectedPriceType.value.value as PRODUCT_PRICE_TYPE;
    }

    if (currentTab.value == "inbound") {
      await store.products.getAllInbounds(req);
    } else {
      await store.products.getAllOutbounds(req);
    }
    isLoading.value = false;
  },
  { deep: true },
);

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  isLoading.value = true;
  page.value = 1;
  if (store.auth.user) {
    if (store.auth.userRole == USER_ROLE.STORE_MANAGER)
      currentTab.value = "outbound";
  }

  if (store.auth.userRole) {
    if (
      !inbounds.value.length &&
      [USER_ROLE.OWNER, USER_ROLE.WAREHOUSE_MANAGER].includes(
        store.auth.userRole,
      )
    ) {
      const req: GetAllInboundsQuery = {
        page: page.value,
        limit: 10,
      };
      await store.products.getAllInbounds(req);
    }

    if (
      !outbounds.value.length &&
      [USER_ROLE.OWNER, USER_ROLE.STORE_MANAGER].includes(store.auth.userRole)
    ) {
      const req: GetAllOutboundsQuery = {
        page: page.value,
        limit: 10,
      };
      await store.products.getAllOutbounds(req);
    }
  }
  isLoading.value = false;
  $q.loading.hide();
});
</script>
<template>
  <q-page class="tw-px-4 tw-py-8">
    <div class="tw-flex tw-w-full tw-items-center">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >{{
          store.auth.userRole == USER_ROLE.OWNER
            ? "Daftar Transaksi Barang"
            : store.auth.userRole == USER_ROLE.STORE_MANAGER
              ? "Daftar Pengeluaran Barang"
              : "Daftar Pemasukan Barang"
        }}</span
      >
      <q-space />
    </div>
    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <q-tabs
      v-if="store.auth.userRole == USER_ROLE.OWNER"
      v-model="currentTab"
      align="left"
      class="tw-my-4"
    >
      <q-tab no-caps class="tab-content" name="inbound" label="Pemasukan" />
      <q-tab no-caps class="tab-content" name="outbound" label="Pengeluaran" />
    </q-tabs>
    <div
      class="tw-my-4 tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-gap-x-4 tw-gap-y-4"
    >
      <q-input
        :dense="$q.screen.lt.sm"
        v-model="productNameFilter"
        outlined
        label="Cari Barang"
        class="text-body-medium md:tw-max-w-[250px] tw-w-full"
        :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        debounce="500"
      />
      <q-input
        :dense="$q.screen.lt.sm"
        v-model="createdByFilter"
        outlined
        :label="currentTab == 'inbound' ? 'Dibuat oleh' : 'Cari Toko'"
        class="text-body-medium md:tw-max-w-[250px] tw-w-full"
        :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        debounce="500"
      />
      <q-select
        v-if="currentTab == 'outbound'"
        :dense="$q.screen.lt.sm"
        filled
        v-model="selectedPriceType"
        :options="priceTypeOpts"
        label="Tipe Harga Jual"
        class="tw-w-full md:tw-w-[150px] text-body-small selector"
        :class="$q.screen.lt.sm ? 'text-mobile' : ''"
      />
      <BaseCalendar v-model:selected-timeframe="selectedTimeframe" />
    </div>

    <InboundTable
      v-if="currentTab == 'inbound'"
      :inbounds="inbounds"
      :total-pages="store.products.inboundsMeta?.total_page ?? 0"
      :total-data="store.products.inboundsMeta?.total_item ?? 0"
      :rows-per-page="10"
      v-model="page"
      :is-editable="store.auth.userRole == USER_ROLE.OWNER"
    />
    <OutboundTable
      v-else
      :outbounds="outbounds"
      :total-pages="store.products.outboundsMeta?.total_page ?? 0"
      :total-data="store.products.outboundsMeta?.total_item ?? 0"
      :rows-per-page="10"
      v-model="page"
      :is-editable="store.auth.userRole == USER_ROLE.OWNER"
    />
  </q-page>
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
.selector {
  :deep(.q-field__inner) {
    background-color: white !important;
  }
  :deep(.q-field__control) {
    border-color: $grey-5 !important;
    border: 1px solid;
    border-radius: 6px;
    background-color: white !important;
  }
}
</style>

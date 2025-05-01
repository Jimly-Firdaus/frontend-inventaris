<script setup lang="ts">
import { useStore } from "src/stores";
import type {
  GetOutboundInsightQuery,
  OutboundInsightDataItem,
} from "src/stores/store/types";
import { DateTime } from "luxon";
import BaseCalendar from "src/components/BaseComponents/BaseCalendar.vue";
import type { QTableProps } from "quasar";
import { formatWithThousandSeparator } from "src/util/number";
import StoreProductsTable from "src/components/Table/StoreProductsTable.vue";
import { USER_ROLE } from "src/constants/user";

const props = defineProps({
  storeId: {
    type: String,
  },
});

const $q = useQuasar();
const store = useStore();

const stores = computed(() => store.stores.stores);
const selectedStore = ref<{ label: string; value: string }>();
const availableStores = computed(() => [
  { value: "", label: "Semua Toko" },
  ...stores.value.map((s) => ({
    value: s.id,
    label: s.name,
  })),
]);

const salesInsight = computed(() => store.products.inboundsInsight);

const totalSales = ref(100000);
const totalPaid = ref(95000);
const totalRemaining = ref(5000);

const page = ref(1);

const insightTableColumns: QTableProps["columns"] = [
  {
    name: "column_name",
    align: "left",
    label: "",
    field: "column_name",
  },
  {
    name: "total",
    align: "right",
    label: "",
    field: "total",
  },
];

const insightRows = computed(() => [
  {
    name: "Total Pembayaran",
    total: totalPaid.value,
  },
  {
    name: "Total Sisa Pembayaran",
    total: totalRemaining.value,
  },
  {
    name: "Total Penjualan",
    total: totalSales.value,
  },
]);

const selectedTimeframe = ref("");
const nameFilter = ref("");

const isLoading = ref(false);

watch(
  [selectedTimeframe],
  async () => {
    $q.loading.show({
      message: "Loading...",
    });
    isLoading.value = true;
    // let req: GetOutboundInsightQuery = {
    //   store_id: props.storeId,
    //   period:
    //     (selectedInterval.value?.value as INSIGHT_INTERVAL) ??
    //     INSIGHT_INTERVAL.ONE_DAY,
    //   from: "",
    //   to: "",
    // };
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
        )
          .endOf("day")
          .toISO({ suppressMilliseconds: true });

        // req = {
        //   ...req,
        //   from: customStart!,
        //   to: customEnd!,
        // };
      }
      // await store.stores.getInsight(req);
    }
    // selectedDate.value = dateOptions.value?.[dateOptions.value.length - 1];
    isLoading.value = false;
    $q.loading.hide();
  },
  { deep: true },
);

watch(page, () => {
  console.log("Updated page");
});

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  const now = DateTime.now().endOf("day").toISO({ suppressMilliseconds: true });
  const sevenDaysAgo = DateTime.now()
    .minus({ days: 7 })
    .startOf("day")
    .toISO({ suppressMilliseconds: true });
  await store.stores.getAllStores();
  selectedStore.value = availableStores.value[0];

  // const req: GetOutboundInsightQuery = {
  //   store_id: props.storeId,
  //   period: INSIGHT_INTERVAL.ONE_DAY,
  //   from: sevenDaysAgo,
  //   to: now,
  // };
  // await store.stores.getInsight(req);
  // items.value = insights.value?.data[0]?.items ?? [];
  $q.loading.hide();
});
</script>
<template>
  <div>
    <div class="bg-grey-3 tw-p-4 tw-rounded-3xl">
      <div class="tw-flex tw-gap-x-4 tw-items-center tw-flex-wrap tw-gap-y-2">
        <span :class="$q.screen.lt.sm ? 'tw-text-xl' : 'tw-text-3xl'"
          >Insight untuk:</span
        >
        <BaseCalendar
          v-model:selected-timeframe="selectedTimeframe"
          use-default
        />

        <template v-if="store.auth.userRole == USER_ROLE.OWNER">
          <q-select
            filled
            v-model="selectedStore"
            :options="availableStores"
            label="Toko"
            class="tw-w-[180px] text-body-small selector"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          />
        </template>
      </div>

      <div class="tw-w-full tw-flex md:tw-flex-row tw-flex-col tw-mt-4">
        <q-table
          :rows="insightRows"
          :columns="insightTableColumns"
          dense
          flat
          hide-pagination
          virtual-scroll
          bordered
          hide-header
          separator="cell"
          class="store-insight-table tw-max-w-[600px] tw-w-full"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="[
                props.row.name === 'Total Modal' ? 'tw-font-bold' : '',
                props.rowIndex === insightRows.length - 1
                  ? 'bg-grey-10 text-white'
                  : '',
              ]"
            >
              <q-td key="column_name" :props="props">
                {{ props.row.name }}
              </q-td>
              <q-td key="total" :props="props">
                {{ formatWithThousandSeparator(Number(props.row.total)) }}
              </q-td>
            </q-tr>
          </template>
          <template #no-data>
            <div class="full-width row flex-center q-gutter-sm q-pa-xl">
              <span class="text-h6"> Tidak ada data </span>
              <q-icon size="2em" name="sentiment_dissatisfied" />
            </div>
          </template>
        </q-table>
      </div>
    </div>

    <q-separator size="1px" class="tw-mb-10 tw-mt-4" color="primary" />

    <div class="tw-flex tw-w-full tw-items-center tw-mt-4">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >Detail Informasi Barang Penjualan</span
      >
      <q-space />
    </div>

    <q-input
      v-model="nameFilter"
      outlined
      label="Cari Barang"
      class="tw-mt-4 text-body-medium"
      :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
      debounce="500"
    />

    <StoreProductsTable
      :products="salesInsight"
      :total-pages="store.products.inboundsInsightMeta?.total_page ?? 0"
      :total-data="store.products.inboundsInsightMeta?.total_item ?? 0"
      :rows-per-page="10"
      v-model="page"
      insight-view
      sales-insight-view
    />
  </div>
</template>
<style scoped lang="scss">
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
.store-insight-table {
  :deep(.q-table td) {
    font-size: 18px;
    @media (max-width: 600px) {
      font-size: 16px;
    }
  }
  :deep(.q-tr) {
    th:first-child {
      position: sticky;
      left: 0;
      z-index: 1;
    }
  }
}
</style>

<script setup lang="ts">
import { useStore } from "src/stores";
import type {
  GetOutboundInsightQuery,
  OutboundInsightDataItem,
} from "src/stores/store/types";
import { INSIGHT_INTERVAL, INSIGHT_INTERVAL_LABEL } from "src/constants/time";
import VueApexCharts from "vue3-apexcharts";
import { DateTime } from "luxon";
import BaseCalendar from "src/components/BaseComponents/BaseCalendar.vue";
import ProductSalesTable from "src/components/Table/ProductSalesTable.vue";

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const store = useStore();

const insights = computed(() => store.stores.storeInsights[props.storeId]);

const items = ref<OutboundInsightDataItem[]>([]);

const formattedDates = computed(
  () =>
    insights.value?.data?.map((d) =>
      DateTime.fromISO(d.date).toFormat("dd LLL"),
    ) ?? [],
);

const dataTitleForSold = ref({
  total: "Total",
  retail: "Retail",
  wholesell: "Grosir",
});

const seriesSold = computed(() => {
  if (!insights.value) return [];
  return [
    {
      name: dataTitleForSold.value.total,
      type: "line",
      data: insights.value?.data.map((d) => d.total_sold),
    },
    {
      name: dataTitleForSold.value.retail,
      type: "column",
      data: insights.value?.data.map((d) => d.total_retail_sold),
    },
    {
      name: dataTitleForSold.value.wholesell,
      type: "column",
      data: insights.value?.data.map((d) => d.total_wholesale_sold),
    },
  ];
});

const chartOptionsSold = computed(() => ({
  chart: {
    fontFamily: '"Manrope", sans-serif',
    type: "line",
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [4, 0, 0],
    curve: "smooth",
  },
  xaxis: {
    categories: formattedDates.value,
  },
  yaxis: {
    title: {
      text: "Jumlah Barang Terjual",
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
  },
  colors: ["#FEB019", "#008FFB", "#00E396"],
  title: {
    text: "Grafik Penjualan Barang",
    align: "center",
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      fontFamily: '"Manrope", sans-serif',
      color: "#263238",
    },
  },
}));

const dataTitleForSales = ref({
  total: "Total",
  retail: "Retail",
  wholesell: "Grosir",
});

const seriesSales = computed(() => {
  if (!insights.value) return [];
  return [
    {
      name: dataTitleForSales.value.total,
      type: "line",
      data: insights.value?.data.map((d) => d.total_revenue),
    },
    {
      name: dataTitleForSales.value.retail,
      type: "column",
      data: insights.value?.data.map((d) => d.total_retail_revenue),
    },
    {
      name: dataTitleForSales.value.wholesell,
      type: "column",
      data: insights.value?.data.map((d) => d.total_wholesale_revenue),
    },
  ];
});

const chartOptionsSales = computed(() => ({
  chart: {
    fontFamily: '"Manrope", sans-serif',
    type: "line",
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [4, 0, 0],
    curve: "smooth",
  },
  xaxis: {
    categories: formattedDates.value,
  },
  yaxis: {
    title: {
      text: "Total Harga Terjual",
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
  },
  colors: ["#FEB019", "#008FFB", "#00E396"],
  title: {
    text: "Grafik Harga Penjualan",
    align: "center",
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      fontFamily: '"Manrope", sans-serif',
      color: "#263238",
    },
  },
}));

const selectedTimeframe = ref("");
const dateOptions = computed(() => insights.value?.data.map((i) => i.date));
const selectedDate = ref(dateOptions.value?.[dateOptions.value.length - 1]);

const intervalOpts = computed(() => [
  ...Object.entries(INSIGHT_INTERVAL_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
]);
const selectedInterval = ref(intervalOpts.value[0]);
const isLoading = ref(false);

watch(selectedDate, () => {
  items.value =
    insights.value?.data.find((d) => d.date == selectedDate.value)?.items ?? [];
});

watch(
  [selectedTimeframe, selectedInterval],
  async () => {
    $q.loading.show({
      message: "Loading...",
    });
    isLoading.value = true;
    let req: GetOutboundInsightQuery = {
      store_id: props.storeId,
      period:
        (selectedInterval.value?.value as INSIGHT_INTERVAL) ??
        INSIGHT_INTERVAL.ONE_DAY,
      from: "",
      to: "",
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
        )
          .endOf("day")
          .toISO({ suppressMilliseconds: true });

        req = {
          ...req,
          from: customStart!,
          to: customEnd!,
        };
      }
      await store.stores.getInsight(req);
    }
    selectedDate.value = dateOptions.value?.[dateOptions.value.length - 1];
    isLoading.value = false;
    $q.loading.hide();
  },
  { deep: true },
);

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  const now = DateTime.now().endOf("day").toISO({ suppressMilliseconds: true });
  const sevenDaysAgo = DateTime.now()
    .minus({ days: 7 })
    .startOf("day")
    .toISO({ suppressMilliseconds: true });

  const req: GetOutboundInsightQuery = {
    store_id: props.storeId,
    period: INSIGHT_INTERVAL.ONE_DAY,
    from: sevenDaysAgo,
    to: now,
  };
  await store.stores.getInsight(req);
  items.value = insights.value?.data[0]?.items ?? [];
  $q.loading.hide();
});
</script>
<template>
  <div>
    <div>
      <div class="tw-flex tw-gap-x-4">
        <BaseCalendar
          v-model:selected-timeframe="selectedTimeframe"
          use-default
        />

        <q-select
          :dense="$q.screen.lt.sm"
          filled
          v-model="selectedInterval"
          :options="intervalOpts"
          label="Interval Waktu"
          class="tw-w-full md:tw-w-[150px] text-body-small selector"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        />
      </div>
    </div>
    <div class="tw-w-full tw-flex md:tw-flex-row tw-flex-col tw-mt-12">
      <div class="tw-w-full tw-max-w-1/2">
        <VueApexCharts
          type="line"
          :options="chartOptionsSold"
          :series="seriesSold"
          height="400"
        />
      </div>
      <div class="tw-w-full tw-max-w-1/2">
        <VueApexCharts
          type="line"
          :options="chartOptionsSales"
          :series="seriesSales"
          height="400"
        />
      </div>
    </div>

    <div class="tw-flex tw-w-full tw-items-center tw-mt-4">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >Detail Informasi Penjualan</span
      >
      <q-space />
    </div>

    <q-select
      :dense="$q.screen.lt.sm"
      filled
      v-model="selectedDate"
      :options="dateOptions"
      label="Tanggal"
      class="tw-w-full md:tw-w-[250px] text-body-small selector tw-my-6"
      :class="$q.screen.lt.sm ? 'text-mobile' : ''"
    >
      <template v-slot:option="{ itemProps, opt }">
        <q-item v-bind="itemProps">
          {{ DateTime.fromISO(opt).toFormat("dd LLL yyyy") }}
        </q-item>
      </template>
      <template v-slot:selected-item="{ opt }">
        <span>
          {{ DateTime.fromISO(opt).toFormat("dd LLL yyyy") }}
        </span>
      </template>
    </q-select>
    <ProductSalesTable :items="items ?? []" :loading="isLoading" />
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
</style>

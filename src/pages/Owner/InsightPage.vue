<script setup lang="ts">
import { useStore } from "src/stores";
import type {
  CreateExpenseInsightReq,
  GetInboundsInsightQuery,
} from "src/stores/product/types";
import StoreProductsTable from "src/components/Table/StoreProductsTable.vue";
import { formatWithThousandSeparator } from "src/util/number";
import { AxiosError } from "axios";
import type { QTableProps } from "quasar";
import { MONTHS, getYearOptions } from "src/constants/time";
import SalesInsight from "src/components/Store/SalesInsight.vue";

const $q = useQuasar();
const store = useStore();

const page = ref(1);

const expenseInsight = computed(() => store.products.expenseInsight);

const inboundsInsight = computed(() => store.products.inboundsInsight);

const totalOperationalCost = ref(0);
const totalExpeditionCost = ref(0);
const totalCapital = computed(() => store.products.inboundsInsightTotalCapital);
const totalUpdated = ref({
  operationalCost: 0,
  expeditionCost: 0,
});
const totalExpense = computed(
  () =>
    Number(totalOperationalCost.value) +
    Number(totalExpeditionCost.value) +
    totalCapital.value,
);

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
    name: "Total Modal Barang",
    total: totalCapital.value,
  },
  {
    name: "Total Operasional",
    total: totalOperationalCost.value,
  },
  {
    name: "Total Ekspedisi",
    total: totalExpeditionCost.value,
  },
  {
    name: "Total Modal",
    total: totalExpense.value,
  },
]);

const isEditing = ref(false);

// Get current month and year
const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

// Year options (from 2024 to current year)
const years = computed(() => getYearOptions());

const selectedMonth = ref(currentMonth);
const selectedYear = ref(currentYear);
const selectedPeriod = computed(
  () =>
    `${selectedYear.value}-${String(selectedMonth.value).padStart(2, "0")}-01`,
);
const selectedPeriodTimestamp = computed(
  () => `${selectedPeriod.value}T00:00:00.000Z`,
);

const nameFilter = ref("");

const currentTab = ref("expense");

const onSaveChanges = async () => {
  $q.loading.show({
    message: "Loading...",
  });

  const req: CreateExpenseInsightReq = {
    period: selectedPeriodTimestamp.value,
    expedition: Number(
      totalUpdated.value.expeditionCost.toString().replaceAll(",", ""),
    ),
    operational: Number(
      totalUpdated.value.operationalCost.toString().replaceAll(",", ""),
    ),
  };

  try {
    await store.products.createExpenseInsight(req);
    totalOperationalCost.value = req.operational;
    totalExpeditionCost.value = req.expedition;
    isEditing.value = false;

    $q.notify({
      message: "Berhasil mengubah data!",
      color: "primary",
      classes: "q-notify-font",
    });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat menyimpan update: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat menyimpan update: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  } finally {
    $q.loading.hide();
  }
};

watch(isEditing, () => {
  if (isEditing.value) {
    Object.assign(totalUpdated.value, {
      operationalCost: totalOperationalCost.value,
      expeditionCost: totalExpeditionCost.value,
    });
  }
});

watch(
  [selectedMonth, selectedYear],
  async () => {
    await store.products.getExpenseInsight(selectedPeriod.value);
    totalExpeditionCost.value = expenseInsight.value.expeditionCost;
    totalOperationalCost.value = expenseInsight.value.operationalCost;

    const req: GetInboundsInsightQuery = {
      period: selectedPeriod.value,
      page: page.value,
      limit: 10,
    };

    await store.products.getInboundsInsight(req);
  },
  { deep: true },
);

watch([page, nameFilter], async () => {
  const req: GetInboundsInsightQuery = {
    period: selectedPeriod.value,
    page: page.value,
    limit: 10,
    product_name: nameFilter.value,
  };

  await store.products.getInboundsInsight(req);
});

watch(currentTab, () => {
  page.value = 1;
  nameFilter.value = "";
  isEditing.value = false;
});

onMounted(async () => {
  const req: GetInboundsInsightQuery = {
    period: selectedPeriod.value,
    page: page.value,
    limit: 10,
  };

  await store.products.getInboundsInsight(req);

  await store.products.getExpenseInsight(selectedPeriod.value);
  totalExpeditionCost.value = expenseInsight.value.expeditionCost;
  totalOperationalCost.value = expenseInsight.value.operationalCost;
});
</script>
<template>
  <q-page class="tw-py-8 tw-px-4">
    <q-tabs v-model="currentTab" align="left">
      <q-tab no-caps class="tab-content" name="expense" label="Modal" />
      <q-tab no-caps class="tab-content" name="sales" label="Penjualan" />
    </q-tabs>
    <div class="tw-flex tw-w-full tw-items-center tw-mt-4">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >{{
          currentTab == "expense" ? "Insight Modal" : "Insight Penjualan"
        }}</span
      >
      <q-space />
      <q-btn
        v-if="isEditing"
        :disable="
          totalUpdated.operationalCost < 0 || totalUpdated.expeditionCost < 0
        "
        no-caps
        :label="$q.screen.lt.sm ? '' : 'Simpan Perubahan'"
        icon="save"
        :size="$q.screen.lt.sm ? 'md' : 'lg'"
        class="tw-rounded-3xl"
        color="primary"
        @click="onSaveChanges"
      />
    </div>

    <q-separator size="1px" class="tw-mb-4 tw-mt-2" color="primary" />
    <q-card
      flat
      v-if="currentTab == 'expense'"
      class="tw-border-2 card-container"
    >
      <div
        class="tw-my-4 bg-grey-3 tw-p-4 tw-rounded-3xl text-grey-10"
        :class="$q.screen.lt.sm ? 'tw-text-lg' : 'tw-text-xl'"
      >
        <div class="tw-mb-4 tw-flex tw-gap-x-4 tw-items-center">
          <span :class="$q.screen.lt.sm ? 'tw-text-xl' : 'tw-text-3xl'"
            >Insight untuk:</span
          >
          <q-select
            filled
            emit-value
            map-options
            v-model="selectedMonth"
            :options="MONTHS"
            label="Bulan"
            class="tw-w-[150px] text-body-small selector"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          />
          <q-select
            filled
            emit-value
            v-model="selectedYear"
            :options="years"
            label="Tahun"
            class="tw-w-[150px] text-body-small selector"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          />
        </div>
        <div class="tw-flex tw-gap-x-4 tw-gap-y-3 tw-flex-wrap">
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
            class="insight-table tw-max-w-[600px] tw-w-full"
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
                  <q-btn
                    v-if="
                      !isEditing &&
                      ['Total Operasional', 'Total Ekspedisi'].includes(
                        props.row.name,
                      )
                    "
                    flat
                    dense
                    no-caps
                    icon="edit"
                    color="primary"
                    class="tw-px-3 tw-rounded-xl tw-ml-2"
                    @click="isEditing = true"
                  />
                </q-td>
                <q-td key="total" :props="props">
                  <template
                    v-if="
                      ['Total Operasional', 'Total Ekspedisi'].includes(
                        props.row.name,
                      )
                    "
                  >
                    <template v-if="!isEditing">
                      {{ formatWithThousandSeparator(Number(props.row.total)) }}
                    </template>
                    <q-input
                      v-else
                      v-model="totalUpdated.operationalCost"
                      outlined
                      label="Biaya Operasional"
                      lazy-rules
                      :rules="[
                        (val: string) =>
                          parseInt(val) >= 0 ||
                          'Biaya operasional tidak boleh negatif!',
                      ]"
                      class="text-body-medium tw-mt-5"
                      :class="$q.screen.lt.sm ? 'text-mobile' : ''"
                      mask="###,###,###,###,###,###,###,###"
                      reverse-fill-mask
                    />
                  </template>
                  <template v-else>
                    {{ formatWithThousandSeparator(Number(props.row.total)) }}
                  </template>
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

      <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

      <p
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
      >
        Detail Data Barang Masuk
      </p>

      <q-input
        v-model="nameFilter"
        outlined
        label="Cari Barang"
        class="tw-mt-4 text-body-medium"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
        debounce="500"
      />

      <StoreProductsTable
        :products="inboundsInsight"
        :total-pages="store.products.inboundsInsightMeta?.total_page ?? 0"
        :total-data="store.products.inboundsInsightMeta?.total_item ?? 0"
        :rows-per-page="10"
        v-model="page"
        insight-view
      />
    </q-card>

    <q-card flat v-else class="tw-border-2 card-container">
      <SalesInsight />
    </q-card>
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
.card-container {
  border-color: $grey-6;
  border-radius: 24px;
}
.insight-table {
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

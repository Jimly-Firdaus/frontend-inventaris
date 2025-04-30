<script setup lang="ts">
import { useStore } from "src/stores";
import type {
  CreateExpenseInsightReq,
  GetInboundsInsightQuery,
} from "src/stores/product/types";
import StoreProductsTable from "src/components/Table/StoreProductsTable.vue";
import { formatWithThousandSeparator } from "src/util/number";
import { AxiosError } from "axios";

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

const isEditing = ref(false);

// Get current month and year
const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();
const months = [
  { label: "Januari", value: 1 },
  { label: "Februari", value: 2 },
  { label: "Maret", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "Juni", value: 6 },
  { label: "Juli", value: 7 },
  { label: "Agustus", value: 8 },
  { label: "September", value: 9 },
  { label: "Oktober", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

// Year options (from 2024 to current year)
const years = Array.from(
  { length: currentYear - 2024 + 1 },
  (_, i) => 2024 + i,
);

const selectedMonth = ref(currentMonth);
const selectedYear = ref(currentYear);
const selectedPeriod = computed(
  () =>
    `${selectedYear.value}-${String(selectedMonth.value).padStart(2, "0")}-01`,
);
const selectedPeriodTimestamp = computed(
  () => `${selectedPeriod.value}T00:00:00.000Z`,
);

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

watch(page, async () => {
  const req: GetInboundsInsightQuery = {
    period: selectedPeriod.value,
    page: page.value,
    limit: 10,
  };

  await store.products.getInboundsInsight(req);
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
    <div class="tw-flex tw-w-full tw-items-center">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >Insight Pengeluaran Modal</span
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
          :options="months"
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
        <q-card
          class="tw-p-3 tw-rounded-3xl tw-w-full tw-max-w-[400px] bg-black text-grey-1"
        >
          <p class="tw-mb-1 tw-font-bold">Total Pengeluaran:</p>
          <p
            class="tw-font-extrabold"
            :class="$q.screen.lt.sm ? 'tw-text-xl' : 'tw-text-2xl'"
          >
            {{ formatWithThousandSeparator(totalExpense) }}
          </p>
        </q-card>
        <q-card class="tw-p-3 tw-rounded-3xl tw-w-full tw-max-w-[400px]">
          <p class="tw-mb-0">Total Biaya Operasional:</p>
          <p
            v-if="!isEditing"
            class="tw-font-bold"
            :class="$q.screen.lt.sm ? 'tw-text-xl' : 'tw-text-2xl'"
          >
            {{ formatWithThousandSeparator(totalOperationalCost) }}
          </p>
          <q-input
            v-else
            v-model="totalUpdated.operationalCost"
            outlined
            label="Biaya Operasional"
            lazy-rules
            :rules="[
              (val: string) =>
                parseInt(val) >= 0 || 'Biaya operasional tidak boleh negatif!',
            ]"
            class="text-body-medium tw-mt-5"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
            mask="###,###,###,###,###,###,###,###"
            reverse-fill-mask
          />
          <q-btn
            v-if="!isEditing"
            dense
            no-caps
            label="Ubah Data"
            color="primary"
            class="tw-px-3 tw-rounded-xl"
            @click="isEditing = true"
          />
        </q-card>
        <q-card class="tw-p-3 tw-rounded-3xl tw-w-full tw-max-w-[400px]">
          <p class="tw-mb-0">Total Biaya Ekspedisi:</p>
          <p
            v-if="!isEditing"
            class="tw-font-bold"
            :class="$q.screen.lt.sm ? 'tw-text-xl' : 'tw-text-2xl'"
          >
            {{ formatWithThousandSeparator(totalExpeditionCost) }}
          </p>
          <q-input
            v-else
            v-model="totalUpdated.expeditionCost"
            outlined
            label="Biaya Ekspedisi"
            lazy-rules
            :rules="[
              (val: string) =>
                parseInt(val) >= 0 || 'Biaya ekspedisi tidak boleh negatif!',
            ]"
            class="text-body-medium tw-mt-5"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
            mask="###,###,###,###,###,###,###,###"
            reverse-fill-mask
          />
          <q-btn
            v-if="!isEditing"
            dense
            no-caps
            label="Ubah Data"
            color="primary"
            class="tw-px-3 tw-rounded-xl"
            @click="isEditing = true"
          />
        </q-card>
        <q-card class="tw-p-3 tw-rounded-3xl tw-w-full tw-max-w-[400px]">
          <p class="tw-mb-0">Total Modal Barang:</p>
          <p
            class="tw-font-bold"
            :class="$q.screen.lt.sm ? 'tw-text-xl' : 'tw-text-2xl'"
          >
            {{ formatWithThousandSeparator(totalCapital) }}
          </p>
        </q-card>
      </div>
    </div>

    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <p
      class="text-grey-10 tw-font-bold"
      :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
    >
      Detail Data Barang Masuk
    </p>
    <StoreProductsTable
      :products="inboundsInsight"
      :total-pages="store.products.inboundsInsightMeta?.total_page ?? 0"
      :total-data="store.products.inboundsInsightMeta?.total_item ?? 0"
      :rows-per-page="10"
      v-model="page"
      insight-view
    />
  </q-page>
</template>
<style scoped lang="scss"></style>

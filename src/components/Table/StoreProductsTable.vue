<script setup lang="ts">
import type { GetAllProductsResponseData, InboundsInsight } from "src/stores/product/types";
import type { QTableProps } from "quasar";
import { formatWithThousandSeparator } from "src/util/number";

const props = defineProps({
  products: {
    type: Array as PropType<GetAllProductsResponseData[] | InboundsInsight[]>,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalData: Number,
  rowsPerPage: {
    type: Number,
    required: true,
  },
  loading: Boolean,
  isEditable: Boolean,
  nameFilter: String,
  insightView: Boolean,
});

const page = defineModel<number>({ required: true });

const baseColumns: QTableProps["columns"] = [
  {
    name: "product_name",
    align: "left",
    label: "Nama Barang",
    field: "product_name",
  },
];

const nonInsightColumns: QTableProps["columns"] = [
  {
    name: "retail_quantity",
    align: "left",
    label: "Eceran",
    field: "retail_quantity",
  },
  {
    name: "wholesale_quantity",
    align: "left",
    label: "Grosir",
    field: "wholesale_quantity",
  },
];

const insightColumns: QTableProps["columns"] = [
  {
    name: "quantity",
    align: "left",
    label: "Jumlah",
    field: "quantity",
  },
  {
    name: "buy_price",
    align: "left",
    label: "Modal",
    field: "buy_price",
  },
];

const columns = computed(() => [
  ...baseColumns,
  ...(props.insightView ? insightColumns : []),
  ...(!props.insightView ? nonInsightColumns : []),
]);
</script>
<template>
  <q-table
    flat
    hide-pagination
    bordered
    virtual-scroll
    style="max-height: 575px"
    :rows="products"
    :columns="columns"
    :rows-per-page-options="[0]"
    :loading="props.loading"
  >
    <template v-slot:body="props">
      <q-tr :props="props" class="tw-cursor-pointer">
        <q-td key="product_name" :props="props">
          {{ props.row.product_name ?? props.row.name ?? props.row.product }}
        </q-td>
        <template v-if="!insightView">
          <q-td key="retail_quantity" :props="props">
            {{ props.row.retail_quantity ?? "0" }}
          </q-td>
          <q-td key="wholesale_quantity" :props="props">
            {{ props.row.wholesale_quantity ?? "0" }}
          </q-td>
        </template>
        <template v-else>
          <q-td key="quantity" :props="props">
            {{ props.row.quantity ?? "0" }}
          </q-td>
          <q-td key="buy_price" :props="props">
            {{ formatWithThousandSeparator(props.row.product_buy_price) ?? "0" }}
          </q-td>
        </template>
      </q-tr>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm q-pa-xl">
        <span class="text-h6"> {{ insightView ? "Tidak ada pemasukan barang." : "Tidak ada produk di toko ini." }} </span>
        <q-icon size="2em" name="sentiment_dissatisfied" />
      </div>
    </template>
  </q-table>
  <div
    v-if="props.totalPages > 1"
    class="tw-flex tw-flex-col tw-items-center tw-justify-center"
  >
    <div class="tw-flex tw-w-full">
      <q-space />
      <div
        v-if="props.totalData"
        class="tw-text-sm tw-text-gray-500 tw-mt-2 tw-text-center"
      >
        {{ (page - 1) * props.rowsPerPage + 1 }}–{{
          Math.min(page * props.rowsPerPage, props.products.length) +
          (page - 1) * props.rowsPerPage
        }}
        dari {{ totalData }} data
      </div>
    </div>
    <q-pagination
      v-model="page"
      class="text-grey-9"
      :max="totalPages"
      :max-pages="1"
      direction-links
      flat
      color="grey-7"
      active-color="grey-9"
    />
  </div>
</template>
<style scoped lang="scss">
// Sticky header
:deep(thead tr:first-child th) {
  background-color: $grey-2;
  top: 0;
}
:deep(thead tr th) {
  position: sticky;
  z-index: 1;
}
:deep(.q-table th) {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  @media (max-width: 600px) {
    font-size: 14px;
    line-height: 20px;
  }
}
:deep(.q-table td) {
  font-size: 16px;
  @media (max-width: 600px) {
    font-size: 14px;
  }
}
:deep(.q-tr) {
  th:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
  }
}
</style>

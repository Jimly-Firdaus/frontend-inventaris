<script setup lang="ts">
import type { QTableProps } from "quasar";
import type { OutboundInsightDataItem } from "src/stores/store/types";
import { formatWithThousandSeparator } from "src/util/number";

const props = defineProps({
  items: {
    type: Array as PropType<OutboundInsightDataItem[]>,
    required: true,
  },
  loading: Boolean,
});

const columns: QTableProps["columns"] = [
  {
    name: "product_name",
    align: "left",
    label: "Nama Barang",
    field: "product_name",
  },
  {
    name: "total_sold",
    align: "left",
    label: "Total Terjual",
    field: "total_sold",
    sortable: true,
  },
  {
    name: "total_retail_sold",
    label: "Total Retail",
    field: "total_retail_sold",
    sortable: false,
  },
  {
    name: "total_wholesale_sold",
    label: "Total Grosir",
    field: "total_wholesale_sold",
    sortable: true,
  },
  {
    name: "avg_retail_price",
    label: "Rata-rata Harga Retail",
    field: "avg_retail_price",
    sortable: false,
  },
  {
    name: "avg_wholesale_price",
    label: "Rata-rata Harga Grosir",
    field: "avg_wholesale_price",
  },
];
</script>
<template>
  <q-table
    flat
    virtual-scroll
    hide-pagination
    bordered
    style="max-height: 575px"
    :rows="props.items"
    :columns="columns"
    :rows-per-page-options="[0]"
    :loading="props.loading"
  >
    <template v-slot:body="props">
      <q-tr :props="props" class="tw-cursor-pointer">
        <q-td key="product_name" :props="props">
          {{ props.row.product_name }}
        </q-td>
        <q-td key="total_sold" :props="props">
          {{ props.row.total_sold }}
        </q-td>
        <q-td key="total_retail_sold" :props="props">
          {{ props.row.total_retail_sold }}
        </q-td>
        <q-td key="total_wholesale_sold" :props="props">
          {{ props.row.total_wholesale_sold }}
        </q-td>
        <q-td key="avg_retail_price" :props="props">
          {{ formatWithThousandSeparator(props.row.avg_retail_price) }}
        </q-td>
        <q-td key="avg_wholesale_price" :props="props">
          {{ formatWithThousandSeparator(props.row.avg_wholesale_price) }}
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

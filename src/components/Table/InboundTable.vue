<script setup lang="ts">
import type { QTableProps } from "quasar";
import type { GetAllInboundsResponseData } from "src/stores/product/types";

const props = defineProps({
  inbounds: {
    type: Array as PropType<GetAllInboundsResponseData[]>,
    required: true,
  },
});

const columns: QTableProps["columns"] = [
  {
    name: "product_name",
    align: "left",
    label: "Nama Barang",
    field: "product_name",
  },
  {
    name: "quantity",
    align: "left",
    label: "Quantity",
    field: "quantity",
  },
  {
    name: "created_by",
    label: "Dibuat Oleh",
    field: "created_by",
    sortable: false,
  },
  {
    name: "created_at",
    label: "Dibuat Pada",
    field: "created_at",
    sortable: false,
  },
  {
    name: "updated_by",
    label: "Diubah Oleh",
    field: "updated_by",
    sortable: false,
  },
  {
    name: "updated_at",
    label: "Diubah Pada",
    field: "updated_at",
    sortable: false,
  },
];
</script>
<template>
  <q-table
    flat
    virtual-scroll
    hide-pagination
    bordered
    style="max-height: 290px"
    :rows="props.inbounds"
    :columns="columns"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props" class="tw-cursor-pointer">
        <q-td key="product_name" :props="props">
          {{ props.row.product_name }}
        </q-td>
        <q-td key="quantity" :props="props">
          {{ props.row.quantity }}
        </q-td>
        <q-td key="created_by" :props="props">
          {{ props.row.created_by }}
        </q-td>
        <q-td key="created_at" :props="props">
          {{ props.row.created_at }}
        </q-td>
        <q-td key="updated_by" :props="props">
          {{ props.row.updated_by }}
        </q-td>
        <q-td key="updated_at" :props="props">
          {{ props.row.updated_at }}
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

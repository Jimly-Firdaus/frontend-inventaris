<script setup lang="ts">
import type {
  // GetAllProductsQuery,
  GetAllProductsResponseData,
} from "src/stores/product/types";
import type { QTableProps } from "quasar";
// import { useStore } from "src/stores";
// import { AxiosError } from "axios";

const props = defineProps({
  products: {
    type: Array as PropType<GetAllProductsResponseData[]>,
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
});

// const $q = useQuasar();
// const store = useStore();
const page = defineModel<number>({ required: true });

const columns: QTableProps["columns"] = [
  {
    name: "product_name",
    align: "left",
    label: "Nama Barang",
    field: "product_name",
  },
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

// const onRequest = async (reqProps: {
//   pagination: { page: number; rowsPerPage: number };
// }) => {
//   $q.loading.show({
//     message: "Loading...",
//   });
//   const { page, rowsPerPage } = reqProps.pagination;
//   try {
//     const req: GetAllProductsQuery = {
//       name: props.nameFilter?.trim().length ? props.nameFilter : undefined,
//       page: page,
//       limit: rowsPerPage,
//     };

//     await store.products.getAllProducts(req);
//     totalPages.value = store.products.productsMeta?.total_page ?? 0;
//     totalData.value = store.products.productsMeta?.total_item ?? 0;
//   } catch (err: unknown) {
//     console.error(err);
//     if (err instanceof AxiosError && err.response?.data?.message) {
//       $q.notify({
//         message: `Terjadi kesalahan saat mengambil data: ${err.response.data.message}`,
//         color: "negative",
//         classes: "q-notify-font",
//       });
//     } else if (err instanceof Error) {
//       $q.notify({
//         message: `Terjadi kesalahan saat mengambil data: ${err.message}`,
//         color: "negative",
//         classes: "q-notify-font",
//       });
//     }
//   } finally {
//     $q.loading.hide();
//   }
// };
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
          {{ props.row.product_name }}
        </q-td>
        <q-td key="retail_quantity" :props="props">
          {{ props.row.retail_quantity ?? "0" }}
        </q-td>
        <q-td key="wholesale_quantity" :props="props">
          {{ props.row.wholesale_quantity ?? "0" }}
        </q-td>
      </q-tr>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm q-pa-xl">
        <span class="text-h6"> Tidak ada produk di toko ini. </span>
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

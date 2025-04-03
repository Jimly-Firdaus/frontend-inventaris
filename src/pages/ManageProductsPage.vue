<script setup lang="ts">
import type { QTableProps } from "quasar";
import { useStore } from "src/stores";
import type { GetAllProductsQuery } from "src/stores/product/types";
import { useRouter, useRoute } from "vue-router";
import AddNewProductModal from "src/components/Modal/AddNewProductModal.vue";
import ManageProductDetails from "src/components/Product/ManageProductDetails.vue";

const $q = useQuasar();
const store = useStore();
const router = useRouter();
const route = useRoute();
const selectedProductId = computed(() => route.query.productId as string);

const showAddNewProductModal = ref(false);

const nameFilter = ref("");

const allProducts = computed(() => store.products.products);
const filteredProducts = computed(() => {
  if (nameFilter.value.length > 0)
    return allProducts.value.filter((p) => p.name.includes(nameFilter.value));
  else return allProducts.value;
});

const columns: QTableProps["columns"] = [
  {
    name: "name",
    align: "left",
    label: "Nama Barang",
    field: "name",
  },
  {
    name: "stock",
    align: "left",
    label: "Total Stock",
    field: "stock",
  },
  {
    name: "buy_price",
    align: "left",
    label: "Modal",
    field: "buy_price",
  },
  {
    name: "wholesale_sell_price",
    align: "left",
    label: "Harga Grosir",
    field: "wholesale_sell_price",
  },
  {
    name: "retail_sell_price",
    align: "left",
    label: "Harga Eceran",
    field: "retail_sell_price",
  },
];

const onClickProduct = async (productId: string) => {
  await router.replace({
    query: {
      productId: productId,
    },
  });
};

onMounted(() => {
  if (!allProducts.value.length) {
    const req: GetAllProductsQuery = {};
    store.products.getAllProducts(req);
  }
});
</script>
<template>
  <q-page class="tw-py-8 tw-px-4">
    <template v-if="!selectedProductId">
      <div class="tw-flex tw-w-full tw-items-center">
        <span
          class="text-grey-10 tw-font-bold"
          :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
          >Daftar Barang</span
        >
        <q-space />
        <q-btn
          no-caps
          :label="$q.screen.lt.sm ? '' : 'Tambah Barang'"
          icon="add"
          @click="showAddNewProductModal = true"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-3xl"
          color="primary"
        />
      </div>
      <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

      <q-input
        v-model="nameFilter"
        outlined
        label="Cari Barang"
        class="tw-mt-4 text-body-medium"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
      />

      <q-table
        flat
        virtual-scroll
        hide-pagination
        :rows="filteredProducts"
        :columns="columns"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @click="onClickProduct(props.row.id)"
            class="tw-cursor-pointer"
          >
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="stock" :props="props">
              {{ props.row.stock }}
            </q-td>
            <q-td key="buy_price" :props="props">
              {{ props.row.buy_price }}
            </q-td>
            <q-td key="wholesale_sell_price" :props="props">
              {{ props.row.wholesale_sell_price }}
            </q-td>
            <q-td key="retail_sell_price" :props="props">{{
              props.row.retail_sell_price
            }}</q-td>
          </q-tr>
        </template>
        <template #no-data>
          <div class="full-width row flex-center q-gutter-sm q-pa-xl">
            <span class="text-h6"> Tidak ada produk sesuai pencarian </span>
            <q-icon size="2em" name="sentiment_dissatisfied" />
          </div>
        </template>
      </q-table>
    </template>
    <template v-else>
      <ManageProductDetails :product-id="selectedProductId" />
    </template>

    <AddNewProductModal
      v-if="showAddNewProductModal"
      v-model="showAddNewProductModal"
    />
  </q-page>
</template>
<style scoped lang="scss">
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
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type="number"]) {
  -moz-appearance: textfield;
}
</style>

<script setup lang="ts">
import type { QTableProps } from "quasar";
import { useStore } from "src/stores";
import { useRouter, useRoute } from "vue-router";
import AddNewProductModal from "src/components/Modal/AddNewProductModal.vue";
import ManageProductDetails from "src/components/Product/ManageProductDetails.vue";
import { USER_ROLE } from "src/constants/user";
import AddProductStockModal from "src/components/Modal/AddProductStockModal.vue";
import type { GetAllProductsQuery } from "src/stores/product/types";
import { formatWithThousandSeparator } from "src/util/number";
import { AxiosError } from "axios";

const $q = useQuasar();
const store = useStore();
const router = useRouter();
const route = useRoute();
const selectedProductId = computed(() => route.query.productId as string);

const showAddNewProductModal = ref(false);
const showAddProductStockModal = ref(false);

const nameFilter = ref("");

const allProducts = computed(() => store.products.products ?? []);

const baseColumns: QTableProps["columns"] = [
  {
    name: "name",
    align: "left",
    label: "Nama Barang",
    field: "name",
  },
  {
    name: "stock",
    align: "left",
    label: "Total Stok",
    field: "stock",
  },
];

const ownerExtraColumns: QTableProps["columns"] = [
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

const actionsColumn: QTableProps["columns"] = [
  {
    name: "action",
    align: "left",
    label: "",
    field: "action",
  },
];

const columns = computed(() => [
  ...baseColumns,
  ...(store.auth.userRole === USER_ROLE.OWNER ? ownerExtraColumns : []),
  ...(store.auth.userRole &&
  [USER_ROLE.OWNER, USER_ROLE.WAREHOUSE_MANAGER].includes(store.auth.userRole)
    ? actionsColumn
    : []),
]);

const selectedProductIdForStockUpdate = ref();

const totalPages = ref(0);
const totalData = ref(0);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

const onUpdateStock = (productId: string) => {
  selectedProductIdForStockUpdate.value = productId;
  showAddProductStockModal.value = true;
};
// const inbounds = computed(() => store.products.inbounds);

const onClickProduct = async (productId: string) => {
  if (store.auth.userRole != USER_ROLE.OWNER) return;
  await router.replace({
    query: {
      productId: productId,
    },
  });
};

const onRequest = async (props: {
  pagination: { page: number; rowsPerPage: number };
}) => {
  $q.loading.show({
    message: "Loading...",
  });
  const { page, rowsPerPage } = props.pagination;
  try {
    const req: GetAllProductsQuery = {
      name: nameFilter.value.trim().length ? nameFilter.value : undefined,
      page: page,
      limit: rowsPerPage,
    };

    await store.products.getAllProducts(req);
    totalPages.value = store.products.productsMeta?.total_page ?? 0;
    totalData.value = store.products.productsMeta?.total_item ?? 0;
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat mengambil data: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat mengambil data: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  } finally {
    $q.loading.hide();
  }
};

watch(
  [pagination, nameFilter],
  async () => {
    await onRequest({ pagination: pagination.value });
  },
  { deep: true },
);

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  const { page, rowsPerPage } = pagination.value;
  const req: GetAllProductsQuery = {
    page: page,
    limit: rowsPerPage,
  };
  await store.products.getAllProducts(req);
  totalPages.value = store.products.productsMeta?.total_page ?? 0;
  totalData.value = store.products.productsMeta?.total_item ?? 0;
  $q.loading.hide();
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
          v-if="store.auth.userRole != USER_ROLE.STORE_MANAGER"
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
        debounce="500"
      />

      <q-table
        flat
        hide-pagination
        bordered
        virtual-scroll
        style="max-height: 575px"
        :rows="allProducts"
        :columns="columns"
        @request="onRequest"
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
            <template v-if="store.auth.userRole == USER_ROLE.OWNER">
              <q-td key="buy_price" :props="props">
                {{
                  props.row.buy_price
                    ? formatWithThousandSeparator(props.row.buy_price)
                    : undefined
                }}
              </q-td>
              <q-td key="wholesale_sell_price" :props="props">
                {{
                  props.row.wholesale_sell_price
                    ? formatWithThousandSeparator(
                        props.row.wholesale_sell_price,
                      )
                    : undefined
                }}
              </q-td>
              <q-td key="retail_sell_price" :props="props">{{
                props.row.retail_sell_price
                  ? formatWithThousandSeparator(props.row.retail_sell_price)
                  : undefined
              }}</q-td>
            </template>
            <template v-if="store.auth.userRole != USER_ROLE.STORE_MANAGER">
              <q-td key="action" :props="props">
                <q-btn
                  dense
                  color="primary"
                  no-caps
                  @click.stop="onUpdateStock(props.row.id)"
                  :size="$q.screen.lt.sm ? 'sm' : 'md'"
                  icon="add"
                  label="Tambah Stok"
                  class="tw-rounded-xl tw-pr-2"
                />
              </q-td>
            </template>
          </q-tr>
        </template>
        <template #no-data>
          <div class="full-width row flex-center q-gutter-sm q-pa-xl">
            <span class="text-h6"> Tidak ada produk </span>
            <q-icon size="2em" name="sentiment_dissatisfied" />
          </div>
        </template>
      </q-table>
      <div
        v-if="totalPages > 1"
        class="tw-flex tw-flex-col tw-items-center tw-justify-center"
      >
        <div class="tw-flex tw-w-full">
          <q-space />
          <div
            v-if="totalData"
            class="tw-text-sm tw-text-gray-500 tw-mt-2 tw-text-center"
          >
            {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }}–{{
              Math.min(
                pagination.page * pagination.rowsPerPage,
                allProducts.length,
              ) +
              (pagination.page - 1) * pagination.rowsPerPage
            }}
            dari {{ totalData }} data
          </div>
        </div>
        <q-pagination
          v-model="pagination.page"
          class="text-grey-9"
          :max="totalPages"
          :max-pages="1"
          direction-links
          flat
          color="grey-7"
          active-color="grey-9"
        />
      </div>
      <!-- <q-card flat bordered class="tw-border-2 tw-mt-16 card-container">
        <div
          class="tw-flex tw-items-center tw-p-4"
          :class="$q.screen.lt.sm ? 'text-mobile tw-mb-2' : 'tw-mb-4'"
        >
          <span
            class="text-grey-10 tw-font-bold text-body-large"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
            >Informasi Pemasukan Barang</span
          >
          <q-space />
        </div>
        <InboundTable :inbounds="inbounds" />
      </q-card> -->
    </template>
    <template v-else>
      <ManageProductDetails :product-id="selectedProductId" />
    </template>

    <AddProductStockModal
      v-if="showAddProductStockModal"
      v-model="showAddProductStockModal"
      :product-id="selectedProductIdForStockUpdate"
    />
    <AddNewProductModal
      v-if="showAddNewProductModal"
      v-model="showAddNewProductModal"
    />
  </q-page>
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
.card-container {
  border-color: $grey-6;
  border-radius: 24px;
}
</style>

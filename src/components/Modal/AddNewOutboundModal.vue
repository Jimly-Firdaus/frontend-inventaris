<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import type { CreateOutboundRequest } from "src/stores/product/types";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import {
  PRODUCT_PRICE_TYPE,
  PRODUCT_PRICE_TYPE_LABEL,
} from "src/constants/price";
import { USER_ROLE } from "src/constants/user";
import { AxiosError } from "axios";
import type {
  GetAllOutboundsQuery,
  GetAllProductsQuery,
} from "src/stores/product/types";

const props = defineProps({
  storeId: {
    type: String,
  },
  storeName: {
    type: String,
  },
});

const $q = useQuasar();
const store = useStore();
const modelValue = defineModel<boolean>({ required: true, default: false });

const selectedProduct = ref<{ label: string; value: string }>();
const availableProductsOpts = computed(() =>
  store.products.products.map((p) => ({
    value: p.id,
    label: p.name,
  })),
);

const options = ref<{ label: string; value: string }[]>([]);
const newOutbound = ref<CreateOutboundRequest>({
  product_id: "",
  store_name: props.storeName ?? "",
  to: store.auth.user?.store_id ?? props.storeId ?? "",
  quantity: 0,
  price_type: PRODUCT_PRICE_TYPE.RETAIL,
});

const priceTypeOpts = computed(() =>
  Object.entries(PRODUCT_PRICE_TYPE_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
);
const selectedPriceType = ref(priceTypeOpts.value[0]);

const showConfirmationModal = ref(false);

const filterProductName = (
  val: string,
  update: (callback: () => void) => void,
  abort: () => void,
) => {
  if (val.length < 2) {
    abort();
    return;
  }
  update(() => {
    void (async () => {
      const needle = val.toLowerCase();
      const req: GetAllProductsQuery = {
        name: needle,
      };
      await store.products.getAllProducts(req);
      options.value = availableProductsOpts.value.filter((v) =>
        v.label.toLowerCase().includes(needle),
      );
    })();
  });
};

const onAddNewOutbound = async () => {
  try {
    if (newOutbound.value && selectedProduct.value && selectedPriceType.value) {
      newOutbound.value.product_id = selectedProduct.value.value;
      newOutbound.value.price_type = selectedPriceType.value
        .value as PRODUCT_PRICE_TYPE;
      newOutbound.value.quantity = Number(newOutbound.value.quantity);
      await store.products.createProductOutbound(newOutbound.value);
      const req: GetAllOutboundsQuery = {
        page: 1,
        limit: 10,
      };

      if (store.auth.userRole == USER_ROLE.STORE_MANAGER) {
        req.store_id = store.auth.user?.store_id ?? props.storeId ?? "";
        await store.products.getAllOutboundsByStoreId(req);
      } else {
        const req: GetAllOutboundsQuery = {
          page: 1,
          limit: 10,
        };
        await store.products.getAllOutbounds(req);
      }
      modelValue.value = false;

      $q.notify({
        message: "Berhasil menambahkan pengeluaran barang baru!",
        color: "primary",
        classes: "q-notify-font",
      });
    }
  } catch (err: unknown) {
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat menambahkan transaksi baru: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat menambahkan transaksi baru: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else {
      $q.notify({
        message: `Terjadi kesalahan saat menambahkan transaksi baru`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  }
};
</script>
<template>
  <q-dialog v-model="modelValue">
    <q-card class="tw-w-full tw-p-8 !tw-rounded-3xl">
      <q-card-section class="tw-p-0">
        <p
          class="tw-mb-0 text-body-large tw-font-bold text-center text-grey-10"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          Tambah Pengeluaran Barang Baru
        </p>
      </q-card-section>
      <q-card-section class="tw-flex tw-flex-col tw-gap-y-2">
        <q-select
          filled
          v-model="selectedProduct"
          use-input
          hide-selected
          fill-input
          input-debounce="500"
          :options="options"
          @filter="filterProductName"
          label="Nama Barang"
          style="padding-bottom: 24px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Tidak ada hasil
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="newOutbound.quantity"
          outlined
          label="Jumlah Barang"
          lazy-rules
          :rules="[
            (val: string) => !!val || 'Jumlah stok baru tidak boleh kosong!',
            (val: string) =>
              parseInt(val) > 0 || 'Jumlah stok harus lebih dari 0!',
          ]"
          class="text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          type="number"
        />
        <q-select
          filled
          v-model="selectedPriceType"
          :options="priceTypeOpts"
          label="Tipe Harga Jual"
          class="tw-w-[150px] text-body-small selector"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        />
      </q-card-section>
      <q-card-section class="row justify-center tw-gap-x-4">
        <q-btn
          outline
          label="Kembali"
          no-caps
          @click="modelValue = false"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
        <q-btn
          :disable="!selectedProduct || newOutbound.quantity <= 0"
          no-caps
          :label="$q.screen.lt.sm ? 'Tambah' : 'Tambah Barang'"
          @click="showConfirmationModal = true"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>

    <ConfirmationModal
      :copy-text="`Apakah Anda yakin ingin menambahkan pengeluaran barang?`"
      v-model="showConfirmationModal"
      @continue="onAddNewOutbound"
    />
  </q-dialog>
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

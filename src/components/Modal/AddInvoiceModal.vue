<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { AxiosError } from "axios";
import type {
  CreateInvoiceItemReq,
  CreateInvoiceReq,
} from "src/stores/store/types";
import type { GetAllProductsQuery } from "src/stores/product/types";
import {
  PRODUCT_PRICE_TYPE,
  PRODUCT_PRICE_TYPE_LABEL,
} from "src/constants/price";
import type { GetAllInvoicesQuery } from "src/stores/store/types";
import { DateTime } from "luxon";

const props = defineProps({
  storeId: String,
  customerName: String,
  timeframe: String,
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

const priceTypeOpts = computed(() =>
  Object.entries(PRODUCT_PRICE_TYPE_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
);
const selectedPriceType = ref(priceTypeOpts.value[0]);

const newInvoice = ref<CreateInvoiceReq>({
  store_id: "",
  customer: "",
  items: [],
});

const newInvoiceItem = ref<CreateInvoiceItemReq>({
  product_id: "",
  quantity: 0,
  amount_paid_tiktok: 0,
  amount_paid_shopee: 0,
  amount_paid_transfer: 0,
  price_type: PRODUCT_PRICE_TYPE.RETAIL,
});

const showConfirmationModal = ref(false);

const invoiceItemFields = ref({
  quantity: 0,
  amount_paid_tiktok: 0,
  amount_paid_shopee: 0,
  amount_paid_transfer: 0,
});

const allowAddNewInvoice = computed(
  () =>
    newInvoice.value.customer.trim().length &&
    selectedProduct.value &&
    selectedPriceType.value,
);

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

const onAddNewInvoice = async () => {
  try {
    if (selectedProduct.value && selectedPriceType.value) {
      Object.assign(newInvoiceItem.value, {
        product_id: selectedProduct.value.value,
        price_type: selectedPriceType.value.value as PRODUCT_PRICE_TYPE,
        quantity: Number(invoiceItemFields.value.quantity),
        amount_paid_tiktok: Number(invoiceItemFields.value.amount_paid_tiktok),
        amount_paid_shopee: Number(invoiceItemFields.value.amount_paid_shopee),
        amount_paid_transfer: Number(
          invoiceItemFields.value.amount_paid_transfer,
        ),
      });

      Object.assign(newInvoice.value, {
        store_id: props.storeId,
        items: [newInvoiceItem.value],
      });

      await store.stores.addInvoice(newInvoice.value);
      let invoiceReq: GetAllInvoicesQuery = {
        page: 1,
        limit: 10,
        order_by: "created_at",
        asc: false,
        store_id: store.auth.user?.store_id ?? props.storeId ?? "",
        customer: props.customerName ?? "",
      };
      if (props.timeframe) {
        const customDates = props.timeframe.split(" - ");
        if (customDates[0] && customDates[1]) {
          const customStart = DateTime.fromFormat(
            customDates[0].trim(),
            "dd LLL, yyyy",
          ).toISO();
          const customEnd = DateTime.fromFormat(
            customDates[1].trim(),
            "dd LLL, yyyy",
          ).toISO();

          invoiceReq = {
            ...invoiceReq,
            created_at_gte: customStart!,
            created_at_lte: customEnd!,
          };
        }
      }
      await store.stores.getAllInvoices(invoiceReq);
      modelValue.value = false;

      $q.notify({
        message: "Berhasil menambah invoice!",
        color: "primary",
        classes: "q-notify-font",
      });
    }
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat menambah invoice: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat menambah invoice: ${err.message}`,
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
          Tambah Invoice
        </p>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="newInvoice.customer"
          outlined
          label="Nama Pembeli"
          lazy-rules
          :rules="[
            (val: string) => !!val || 'Nama pembeli tidak boleh kosong!',
          ]"
          class="text-body-medium tw-mt-5"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        />
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
        <q-select
          filled
          v-model="selectedPriceType"
          :options="priceTypeOpts"
          label="Tipe Harga Jual"
          class="tw-w-[150px] text-body-small selector"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        />
        <q-input
          v-model="invoiceItemFields.quantity"
          outlined
          label="Quantity"
          lazy-rules
          :rules="[
            (val: string) => !!val || 'Jumlah quantity tidak boleh kosong!',
            (val: string) =>
              parseInt(val) > 0 || 'Jumlah quantity harus lebih dari 0!',
          ]"
          class="text-body-medium tw-mt-5"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          type="number"
        />
        <q-input
          v-model="invoiceItemFields.amount_paid_tiktok"
          outlined
          label="Nominal Pembayaran Tiktok"
          lazy-rules
          :rules="[
            (val: string) => !!val || 'Nominal pembayaran tidak boleh kosong!',
            (val: string) =>
              parseInt(val) >= 0 || 'Nominal pembayaran tidak boleh negatif!',
          ]"
          class="text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          type="number"
        />
        <q-input
          v-model="invoiceItemFields.amount_paid_shopee"
          outlined
          label="Nominal Pembayaran Shopee"
          lazy-rules
          :rules="[
            (val: string) => !!val || 'Nominal pembayaran tidak boleh kosong!',
            (val: string) =>
              parseInt(val) >= 0 || 'Nominal pembayaran tidak boleh negatif!',
          ]"
          class="text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          type="number"
        />
        <q-input
          v-model="invoiceItemFields.amount_paid_transfer"
          outlined
          label="Nominal Pembayaran Transfer"
          lazy-rules
          :rules="[
            (val: string) => !!val || 'Nominal pembayaran tidak boleh kosong!',
            (val: string) =>
              parseInt(val) > 0 || 'Nominal pembayaran tidak boleh negatif!',
          ]"
          class="text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          type="number"
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
          :disable="!allowAddNewInvoice"
          no-caps
          label="Tambah Invoice"
          @click="showConfirmationModal = true"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>

    <ConfirmationModal
      :copy-text="`Apakah Anda yakin ingin menambah invoice?`"
      v-model="showConfirmationModal"
      @continue="onAddNewInvoice"
    />
  </q-dialog>
</template>
<style scoped lang="scss"></style>

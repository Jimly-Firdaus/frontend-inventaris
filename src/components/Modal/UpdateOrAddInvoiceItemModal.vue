<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { AxiosError } from "axios";
import type { InvoiceItem } from "src/stores/store/types";
import type { GetAllProductsQuery } from "src/stores/product/types";
import {
  PRODUCT_PRICE_TYPE,
  PRODUCT_PRICE_TYPE_LABEL,
} from "src/constants/price";

const props = defineProps({
  invoiceItem: Object as PropType<InvoiceItem | undefined>,
  invoiceId: String,
  isUpdate: Boolean,
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

const newInvoiceItem = ref<InvoiceItem>({
  id: "axaxax",
  invoice_id: "",
  product_id: "",
  product_name: "",
  price: 0,
  quantity: 0,
  tiktok_payment_amount: 0,
  shopee_payment_amount: 0,
  transfer_payment_amount: 0,
  price_type: PRODUCT_PRICE_TYPE.RETAIL,
});

const showConfirmationModal = ref(false);

const invoiceItemFields = ref({
  quantity: 0,
  tiktok_payment_amount: 0,
  shopee_payment_amount: 0,
  transfer_payment_amount: 0,
});

const allowUpdate = computed(
  () =>
    (props.invoiceItem &&
      (invoiceItemFields.value.quantity != props.invoiceItem.quantity ||
        invoiceItemFields.value.tiktok_payment_amount !=
          props.invoiceItem.tiktok_payment_amount ||
        invoiceItemFields.value.shopee_payment_amount !=
          props.invoiceItem.shopee_payment_amount ||
        invoiceItemFields.value.transfer_payment_amount !=
          props.invoiceItem.transfer_payment_amount)) ||
    (!props.isUpdate && selectedProduct.value && selectedPriceType.value),
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

const onAddNewInvoiceItem = () => {
  try {
    if (
      !props.isUpdate &&
      props.invoiceId &&
      selectedProduct.value &&
      selectedPriceType.value
    ) {
      const product = store.products.products.find(
        (p) => p.id == selectedProduct?.value?.value,
      );
      Object.assign(newInvoiceItem.value, {
        invoice_id: props.invoiceId,
        product_id: selectedProduct.value.value,
        product_name: selectedProduct.value.label,
        price:
          (selectedPriceType.value.value as PRODUCT_PRICE_TYPE) ==
          PRODUCT_PRICE_TYPE.RETAIL
            ? product?.retail_sell_price
            : product?.wholesale_sell_price,
        price_type: selectedPriceType.value.value as PRODUCT_PRICE_TYPE,
        quantity: Number(invoiceItemFields.value.quantity),
        tiktok_payment_amount: Number(
          invoiceItemFields.value.tiktok_payment_amount,
        ),
        shopee_payment_amount: Number(
          invoiceItemFields.value.shopee_payment_amount,
        ),
        transfer_payment_amount: Number(
          invoiceItemFields.value.transfer_payment_amount,
        ),
      });

      store.stores.addInvoiceItem(props.invoiceId, newInvoiceItem.value);
      modelValue.value = false;

      $q.notify({
        message: "Berhasil menambah data invoice!",
        color: "primary",
        classes: "q-notify-font",
      });
    }
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat menambah data invoice: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat menambah data invoice: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  }
};

const onUpdateInvoiceItem = () => {
  try {
    if (props.invoiceItem) {
      const updatedInvoiceItem = props.invoiceItem;
      Object.assign(updatedInvoiceItem, {
        quantity: Number(invoiceItemFields.value.quantity),
        tiktok_payment_amount: Number(
          invoiceItemFields.value.tiktok_payment_amount,
        ),
        shopee_payment_amount: Number(
          invoiceItemFields.value.shopee_payment_amount,
        ),
        transfer_payment_amount: Number(
          invoiceItemFields.value.transfer_payment_amount,
        ),
      });
      store.stores.updateInvoiceItem(
        props.invoiceItem.id,
        props.invoiceItem.invoice_id,
        updatedInvoiceItem,
      );
      modelValue.value = false;

      $q.notify({
        message: "Berhasil mengubah data invoice!",
        color: "primary",
        classes: "q-notify-font",
      });
    }
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat mengubah data invoice: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat mengubah data invoice: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  }
};

onMounted(() => {
  if (props.invoiceItem && props.isUpdate) {
    invoiceItemFields.value = {
      quantity: props.invoiceItem.quantity,
      tiktok_payment_amount: props.invoiceItem.tiktok_payment_amount,
      shopee_payment_amount: props.invoiceItem.shopee_payment_amount,
      transfer_payment_amount: props.invoiceItem.transfer_payment_amount,
    };
  }
});
</script>
<template>
  <q-dialog v-model="modelValue">
    <q-card class="tw-w-full tw-p-8 !tw-rounded-3xl">
      <q-card-section class="tw-p-0">
        <p
          class="tw-mb-0 text-body-large tw-font-bold text-center text-grey-10"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          {{ props.isUpdate ? "Ubah Data Invoice" : "Tambah Data Invoice" }}
        </p>
      </q-card-section>
      <q-card-section>
        <template v-if="!props.isUpdate">
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
        </template>
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
          v-model="invoiceItemFields.tiktok_payment_amount"
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
          v-model="invoiceItemFields.shopee_payment_amount"
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
          v-model="invoiceItemFields.transfer_payment_amount"
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
          :disable="!allowUpdate"
          no-caps
          :label="props.isUpdate ? 'Ubah' : 'Tambah'"
          @click="showConfirmationModal = true"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>

    <ConfirmationModal
      :copy-text="`Apakah Anda yakin ingin ${props.isUpdate ? 'mengubah' : 'menambah'} data invoice?`"
      v-model="showConfirmationModal"
      @continue="props.isUpdate ? onUpdateInvoiceItem() : onAddNewInvoiceItem()"
    />
  </q-dialog>
</template>
<style scoped lang="scss"></style>

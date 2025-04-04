<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import type { CreateInboundData } from "src/stores/product/types";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const store = useStore();
const modelValue = defineModel<boolean>({ required: true, default: false });

const additionalStock = ref("0");
const showConfirmationModal = ref(false);

const onAddNewInbound = async () => {
  try {
    const req: CreateInboundData = {
      product_id: props.productId,
      quantity: Number(additionalStock.value),
    };
    await store.products.createProductInbound(req);
    await store.products.getAllProducts();

    modelValue.value = false;

    $q.notify({
      message: "Berhasil menambahkan stok barang!",
      color: "primary",
      classes: "q-notify-font",
    });
  } catch (err) {
    console.error(err);
    $q.notify({
      message: "Terjadi kesalahan saat menambahkan stok barang",
      color: "negative",
      classes: "q-notify-font",
    });
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
          Tambah Stok Barang
        </p>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="additionalStock"
          outlined
          label="Jumlah stok baru"
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
          :disable="
            additionalStock.length == 0 || parseInt(additionalStock) <= 0
          "
          no-caps
          :label="$q.screen.lt.sm ? 'Tambah' : 'Tambah Stok'"
          @click="showConfirmationModal = true"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>

    <ConfirmationModal
      :copy-text="`Apakah Anda yakin ingin menambahkan stok sebesar ${additionalStock}?`"
      v-model="showConfirmationModal"
      @continue="onAddNewInbound"
    />
  </q-dialog>
</template>
<style scoped lang="scss">
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

<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import type { CreateProductRequest } from "src/stores/product/types";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";

const $q = useQuasar();
const store = useStore();
const modelValue = defineModel<boolean>({ required: true, default: false });

const newProduct = ref<CreateProductRequest>({
  name: "",
  stock: 0,
});
const showConfirmationModal = ref(false);

const onAddNewProduct = async () => {
  try {
    if (newProduct.value) {
      newProduct.value.stock = Number(newProduct.value.stock);
      await store.products.createNewProduct(newProduct.value);
      await store.products.getAllProducts();
      modelValue.value = false;

      $q.notify({
        message: "Berhasil menambahkan barang baru!",
        color: "primary",
        classes: "q-notify-font",
      });
    }
  } catch (err) {
    console.error(err);
    $q.notify({
      message: "Terjadi kesalahan saat menambahkan barang baru.",
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
          Tambah Barang Baru
        </p>
      </q-card-section>
      <q-card-section class="tw-flex tw-flex-col tw-gap-y-4">
        <q-input
          hide-bottom-space
          v-model="newProduct.name"
          outlined
          label="Nama Barang"
          lazy-rules
          :rules="[(val: string) => !!val || 'Nama barang tidak boleh kosong!']"
          class="text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        />
        <q-input
          v-model="newProduct.stock"
          outlined
          label="Jumlah Stok"
          type="number"
        />
        <!-- <q-input
          v-model="newProduct.buy_price"
          outlined
          label="Modal"
          type="number"
        />
        <q-input
          v-model="newProduct.wholesale_sell_price"
          outlined
          label="Harga Grosir"
          type="number"
        />
        <q-input
          v-model="newProduct.retail_sell_price"
          outlined
          label="Harga Eceran"
          type="number"
        /> -->
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
          :disable="newProduct.name.length == 0"
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
      :copy-text="`Apakah Anda yakin ingin menambahkan barang ${newProduct?.name}?`"
      v-model="showConfirmationModal"
      @continue="onAddNewProduct"
    />
  </q-dialog>
</template>
<style scoped lang="scss"></style>

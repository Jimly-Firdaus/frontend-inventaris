<script setup lang="ts">
import { useStore } from "src/stores";
import type { CreateStoreRequest } from "src/stores/store/types";

const store = useStore();
const modelValue = defineModel<boolean>({ required: true, default: false });

const newStoreName = ref("");

// TODO: integrate with API
const onAddNewStore = () => {
  console.log("Added new store", newStoreName.value);
  const req: CreateStoreRequest = {
    name: newStoreName.value,
  };
  store.stores.createNewStore(req);

  modelValue.value = false;
};
</script>
<template>
  <q-dialog v-model="modelValue">
    <q-card class="tw-w-full tw-p-8 !tw-rounded-3xl">
      <q-card-section class="tw-p-0">
        <p class="tw-mb-0 text-body-large text-center text-grey-10">
          Tambah Toko Baru
        </p>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="newStoreName"
          outlined
          label="Nama Toko"
          lazy-rules
          :rules="[(val: string) => !!val || 'Nama toko tidak boleh kosong!']"
        />
      </q-card-section>
      <q-card-section class="row justify-center tw-gap-x-4">
        <q-btn
          outline
          label="Kembali"
          no-caps
          @click="modelValue = false"
          size="lg"
          class="tw-rounded-2xl text-grey-10"
        />
        <q-btn
          no-caps
          label="Tambah Toko"
          @click="onAddNewStore"
          color="primary"
          size="lg"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss"></style>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import type { CreateStoreRequest } from "src/stores/store/types";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { AxiosError } from "axios";

const $q = useQuasar();
const store = useStore();
const modelValue = defineModel<boolean>({ required: true, default: false });

const newStoreName = ref("");
const showConfirmationModal = ref(false);

const onAddNewStore = async () => {
  try {
    $q.loading.show({
      message: "Loading...",
    });
    const req: CreateStoreRequest = {
      name: newStoreName.value,
    };
    await store.stores.createNewStore(req);

    modelValue.value = false;

    $q.notify({
      message: "Berhasil menambahkan toko baru!",
      color: "primary",
      classes: "q-notify-font",
    });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat menambahkan toko baru: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat menambahkan toko baru: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  } finally {
    $q.loading.hide();
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
          class="text-body-medium"
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
          :disable="newStoreName.length == 0"
          no-caps
          :label="$q.screen.lt.sm ? 'Tambah' : 'Tambah Toko'"
          @click="showConfirmationModal = true"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>

    <ConfirmationModal
      :copy-text="`Apakah Anda yakin ingin menambahkan toko ${newStoreName}?`"
      v-model="showConfirmationModal"
      @continue="onAddNewStore"
    />
  </q-dialog>
</template>
<style scoped lang="scss"></style>

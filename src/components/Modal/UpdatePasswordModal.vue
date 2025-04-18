<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { AxiosError } from "axios";

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const store = useStore();
const modelValue = defineModel<boolean>({ required: true, default: false });

const newPassword = ref("");
const showConfirmationModal = ref(false);

const onUpdateUserPassword = async () => {
  try {
    await store.auth.updatePassword(props.userId, newPassword.value);
    modelValue.value = false;

    $q.notify({
      message: "Berhasil mengubah password!",
      color: "primary",
      classes: "q-notify-font",
    });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat mengubah password: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat mengubah password: ${err.message}`,
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
          Ubah Password
        </p>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="newPassword"
          outlined
          label="Password Baru"
          lazy-rules
          :rules="[(val: string) => !!val || 'Password tidak boleh kosong!']"
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
          :disable="newPassword.length == 0"
          no-caps
          :label="$q.screen.lt.sm ? 'Ubah' : 'Ubah Password'"
          @click="showConfirmationModal = true"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>

    <ConfirmationModal
      :copy-text="`Apakah Anda yakin ingin mengubah password?`"
      v-model="showConfirmationModal"
      @continue="onUpdateUserPassword"
    />
  </q-dialog>
</template>
<style scoped lang="scss"></style>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { useStore } from "src/stores";
import type { CreateUserRequest } from "src/stores/auth/types";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import type { USER_ROLE } from "src/constants/user";

const props = defineProps({
  userRole: {
    type: String as PropType<USER_ROLE>,
    required: true,
  },
  storeId: String,
  storeName: String,
})

const $q = useQuasar();
const store = useStore();
const modelValue = defineModel<boolean>({ required: true, default: false });

const newUser = ref<CreateUserRequest>({
  username: "",
  password: "",
  role: props.userRole,
  store_id: props.storeId,
  store_name: props.storeName,
})
const showConfirmationModal = ref(false);

// TODO: integrate with API
const onAddNewUserAccount = () => {
  console.log("Added new user account", newUser.value);
  store.auth.createNewUserAccount(newUser.value);

  modelValue.value = false;

  $q.notify({
    message: "Berhasil menambahkan user baru!",
    color: "primary",
  });
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
          Tambah User Baru
        </p>
      </q-card-section>
      <q-card-section class="tw-flex tw-flex-col tw-gap-y-4">
        <q-input
          v-model="newUser.username"
          outlined
          label="Username"
          lazy-rules
          :rules="[(val: string) => !!val || 'Username tidak boleh kosong!']"
          class="text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        />
        <q-input
          v-model="newUser.password"
          outlined
          label="Password"
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
          no-caps
          :label="$q.screen.lt.sm ? 'Tambah' : 'Tambah User'"
          @click="showConfirmationModal = true"
          color="primary"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-2xl text-grey-10"
        />
      </q-card-section>
    </q-card>

    <ConfirmationModal
      :copy-text="`Apakah Anda yakin ingin menambahkan user ${newUser.username}?`"
      v-model="showConfirmationModal"
      @continue="onAddNewUserAccount"
    />
  </q-dialog>
</template>
<style scoped lang="scss"></style>

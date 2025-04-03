<script setup lang="ts">
import UserDataTable from "src/components/Table/UserDataTable.vue";
import AddNewUserAccountModal from "src/components/Modal/AddNewUserAccountModal.vue";
import { useStore } from "src/stores";
import { USER_ROLE } from "src/constants/user";

const store = useStore();
const warehouseManagers = computed(() =>
  store.auth.users.filter((u) => u.role == USER_ROLE.WAREHOUSE_MANAGER),
);

const showAddNewUserAccountModal = ref(false);

onMounted(() => {
  if (!store.auth.users.length) {
    // const payload: GetAllStoresQuery = {};
    store.auth.getAllUsers();
  }
});
</script>
<template>
  <q-page class="tw-px-4 tw-py-8">
    <div class="tw-flex tw-w-full tw-items-center">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >Daftar Akun Gudang</span
      >
      <q-space />
      <q-btn
        no-caps
        :label="$q.screen.lt.sm ? '' : 'Tambah Akun'"
        icon="add"
        @click="showAddNewUserAccountModal = true"
        :size="$q.screen.lt.sm ? 'md' : 'lg'"
        class="tw-rounded-3xl"
        color="primary"
      />
    </div>
    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <UserDataTable :user-data="warehouseManagers" />

    <AddNewUserAccountModal
      v-if="showAddNewUserAccountModal"
      v-model="showAddNewUserAccountModal"
      :user-role="USER_ROLE.WAREHOUSE_MANAGER"
    />
  </q-page>
</template>
<style scoped lang="scss"></style>

<script setup lang="ts">
import type { GetUsersResponseData } from "src/stores/auth/types";
import type { QTableProps } from "quasar";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import UpdatePasswordModal from "src/components/Modal/UpdatePasswordModal.vue";
import { useStore } from "src/stores";

const props = defineProps({
  userData: {
    type: Array as PropType<GetUsersResponseData[]>,
    required: true,
  },
});

const $q = useQuasar();
const store = useStore();
const showUpdatePasswordModal = ref(false);
const selectedUserAccountId = ref("");
const showConfirmationModal = ref(false);

const columns: QTableProps["columns"] = [
  {
    name: "username",
    align: "left",
    label: "Username",
    field: "username",
  },
  {
    name: "updated_at",
    align: "left",
    label: "Update Terakhir",
    field: "updated_at",
  },
  {
    name: "update_password",
    label: "",
    field: "update_password",
    sortable: false,
  },
  {
    name: "delete_user",
    label: "",
    field: "delete_user",
    sortable: false,
  },
];

const onUpdateUserPassword = (userId: string) => {
  selectedUserAccountId.value = userId;
  showUpdatePasswordModal.value = true;
};

const onDeleteUserAccount = (userId: string) => {
  selectedUserAccountId.value = userId;
  showConfirmationModal.value = true;
};

const onConfirmDelete = () => {
  store.auth.deleteUser(selectedUserAccountId.value);
  selectedUserAccountId.value = "";

  $q.notify({
    message: "Berhasil menghapus user!",
    color: "primary",
  });
};
</script>
<template>
  <q-table
    flat
    virtual-scroll
    hide-pagination
    bordered
    :rows="props.userData"
    :columns="columns"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props" class="tw-cursor-pointer">
        <q-td key="username" :props="props">
          {{ props.row.username }}
        </q-td>
        <q-td key="updated_at" :props="props">
          {{ props.row.updated_at }}
        </q-td>
        <q-td key="update_password" :props="props">
          <q-btn
            dense
            color="primary"
            no-caps
            @click="onUpdateUserPassword(props.row.id)"
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
            label="Ubah Password"
          />
        </q-td>
        <q-td key="delete_user" :props="props">
          <q-btn
            dense
            outline
            unelevated
            no-caps
            icon="delete_forever"
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
            @click="onDeleteUserAccount(props.row.id)"
            :label="$q.screen.lt.sm ? '' : 'Hapus'"
          />
        </q-td>
      </q-tr>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm q-pa-xl">
        <span class="text-h6"> Tidak ada user </span>
        <q-icon size="2em" name="sentiment_dissatisfied" />
      </div>
    </template>
  </q-table>

  <UpdatePasswordModal
    v-if="showUpdatePasswordModal"
    v-model="showUpdatePasswordModal"
    :user-id="selectedUserAccountId"
  />
  <ConfirmationModal
    copy-text="Apakah Anda yakin ingin menghapus user ini?"
    v-model="showConfirmationModal"
    is-warning
    @continue="onConfirmDelete"
  />
</template>
<style scoped lang="scss">
// Sticky header
:deep(thead tr:first-child th) {
  background-color: $grey-2;
  top: 0;
}
:deep(thead tr th) {
  position: sticky;
  z-index: 1;
}
:deep(.q-table th) {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  @media (max-width: 600px) {
    font-size: 14px;
    line-height: 20px;
  }
}
:deep(.q-table td) {
  font-size: 16px;
  @media (max-width: 600px) {
    font-size: 14px;
  }
}
:deep(.q-tr) {
  th:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
  }
}
</style>

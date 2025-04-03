<script setup lang="ts">
import { useStore } from "src/stores";
// import type { GetAllStoresQuery } from "src/stores/store/types";
import AddNewUserAccountModal from "src/components/Modal/AddNewUserAccountModal.vue";
// import { useRoute } from "vue-router";
import BackButton from "src/components/Button/BackButton.vue";
import UserDataTable from "src/components/Table/UserDataTable.vue";
import { USER_ROLE } from "src/constants/user";
import AddNewOutboundModal from "src/components/Modal/AddNewOutboundModal.vue";
import OutboundTable from "src/components/Table/OutboundTable.vue";

const props = defineProps({
  storeId: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const store = useStore();
const outbounds = computed(() => store.products.outbounds?.filter((o) => o.store_name == props.storeName));
// const route = useRoute();

const storeManagers = computed(() =>
  store.auth.users.filter((u) => u.store_name == props.storeName),
);

const usernameFilter = ref("");

const filteredStoreManagers = computed(() => {
  if (usernameFilter.value.length > 0)
    return storeManagers.value.filter((sm) =>
      sm.username.includes(usernameFilter.value),
    );
  else return storeManagers.value;
});

const showAddNewStoreManagerModal = ref(false);
const showAddNewOutboundModal = ref(false);

// TODO: to show selected store details (account, outbound items?) as expansion item
// const onClickStoreManager = (userId: string) => {
//   console.log("UserID: ", userId, "clicked!");
// };

onMounted(() => {
  if (!store.auth.users.length) {
    // const payload: GetAllStoresQuery = {};
    store.auth.getAllStoreUsers(props.storeName);
  }

  if (!store.products.outbounds.length) {
    store.products.getAllOutbounds();
  }
  // if (!store.products.products.length) {
  //   store.products.getAllProducts();
  // }
});
</script>
<template>
  <div>
    <BackButton is-remove-route-query />
    <p
      class="text-grey-10 tw-mt-4 tw-font-bold"
      :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
    >
      Detail Informasi {{ storeName }}
    </p>
    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <q-card flat bordered class="tw-border-2 card-container">
      <div class="tw-flex tw-items-center tw-p-4">
        <span
          class="text-grey-10 tw-font-bold text-body-large"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >Informasi User Toko</span
        >
        <q-space />
        <q-btn
          no-caps
          :label="$q.screen.lt.sm ? '' : 'Tambah User'"
          icon="add"
          @click="showAddNewStoreManagerModal = true"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-3xl"
          color="primary"
        />
      </div>
      <q-input
        v-model="usernameFilter"
        outlined
        label="Cari Username"
        class="tw-mt-4 text-body-medium tw-px-2"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
      />

      <UserDataTable :user-data="filteredStoreManagers" />
    </q-card>

    <q-card flat bordered class="tw-border-2 tw-mt-8 card-container">
      <div class="tw-flex tw-items-center tw-p-4" :class="$q.screen.lt.sm ? 'text-mobile tw-mb-2' : 'tw-mb-4'">
        <span
          class="text-grey-10 tw-font-bold text-body-large"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >Informasi Transaksi Toko</span
        >
        <q-space />
        <q-btn
          no-caps
          :label="$q.screen.lt.sm ? '' : 'Tambah Transaksi'"
          icon="add"
          @click="showAddNewOutboundModal = true"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-3xl"
          color="primary"
        />
      </div>

      <OutboundTable :outbounds="outbounds"/>
    </q-card>


    <AddNewUserAccountModal
      v-if="showAddNewStoreManagerModal"
      v-model="showAddNewStoreManagerModal"
      :user-role="USER_ROLE.STORE_MANAGER"
      :store-id="props.storeId"
      :store-name="props.storeName"
    />
    <AddNewOutboundModal
      v-model="showAddNewOutboundModal"
      :store-id="props.storeId"
      :store-name="props.storeName"
    />
  </div>
</template>
<style scoped lang="scss">
.card-container {
  border-color: $grey-6;
  border-radius: 24px;
}
</style>

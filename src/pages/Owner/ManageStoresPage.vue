<script setup lang="ts">
import { useStore } from "src/stores";
import type { GetAllStoresQuery } from "src/stores/store/types";
import AddNewStoreModal from "src/components/Modal/AddNewStoreModal.vue";

const store = useStore();
const availableStores = computed(() => store.stores.stores);

const nameFilter = ref("");

const filteredStores = computed(() => {
  if (nameFilter.value.length > 0)
    return availableStores.value.filter((s) =>
      s.name.includes(nameFilter.value),
    );
  else return availableStores.value;
});

const showAddNewStoreModal = ref(false);

// TODO: to show selected store details (account, outbound items?) as expansion item
const onClickStoreName = (storeId: string) => {
  console.log("StoreID: ", storeId, "clicked!");
};

onMounted(() => {
  const payload: GetAllStoresQuery = {};
  store.stores.getAllStores(payload);
});
</script>
<template>
  <q-page class="tw-py-8 tw-px-4">
    <div class="tw-flex tw-w-full tw-items-center">
      <span class="text-grey-10" :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'">Daftar Toko</span>
      <q-space />
      <q-btn
        no-caps
        :label="$q.screen.lt.sm ? '' : 'Tambah Toko'"
        icon="add"
        @click="showAddNewStoreModal = true"
        :size="$q.screen.lt.sm ? 'md' : 'lg'"
        class="tw-rounded-3xl"
        color="primary"
      />
    </div>

    <q-input
      v-model="nameFilter"
      outlined
      label="Cari Toko"
      class="tw-mt-4 text-body-medium"
      :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
    />
    <q-card flat bordered>
      <template v-if="filteredStores.length">
        <template v-for="(store, idx) in filteredStores" :key="store.id">
          <q-card-section
            class="tw-cursor-pointer card-content tw-p-0 text-grey-10"
            @click="onClickStoreName(store.id)"
          >
            <p class="text-body-large tw-mb-0 tw-py-4 tw-px-4" :class="$q.screen.lt.sm ? 'text-mobile' : ''">
              {{ idx + 1 }}. {{ store.name }}
            </p>
          </q-card-section>
          <q-separator
            v-if="filteredStores.length > 1 && idx != filteredStores.length - 1"
          />
        </template>
      </template>
      <p v-else class="text-h6 tw-px-4 tw-py-4 text-grey-9 text-center">
        Toko "{{ nameFilter }}" tidak ditemukan.
      </p>
    </q-card>

    <AddNewStoreModal v-if="showAddNewStoreModal" v-model="showAddNewStoreModal" />
  </q-page>
</template>
<style scoped lang="scss">
.card-content {
  :hover {
    background-color: $grey-4;
  }
}
</style>

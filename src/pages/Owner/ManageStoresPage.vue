<script setup lang="ts">
import { useStore } from "src/stores";
import type { GetAllStoresQuery } from "src/stores/store/types";
import AddNewStoreModal from "src/components/Modal/AddNewStoreModal.vue";
import { useRoute, useRouter } from "vue-router";
import ManageStoreDetails from "src/components/Store/ManageStoreDetails.vue";
import { USER_ROLE } from "src/constants/user";

const $q = useQuasar();
const store = useStore();
const route = useRoute();
const router = useRouter();
const availableStores = computed(() => store.stores.stores);
const selectedStoreId = computed(() => route.query.storeId as string);
const selectedStoreName = computed(() => route.query.storeName as string);

const nameFilter = ref("");

const filteredStores = computed(() => {
  if (nameFilter.value.length > 0)
    return availableStores.value.filter((s) =>
      s.name.toLocaleLowerCase().includes(nameFilter.value.toLocaleLowerCase()),
    );
  else return availableStores.value;
});

const showAddNewStoreModal = ref(false);

const onClickStoreName = async (storeId: string, storeName: string) => {
  await router.replace({
    query: {
      storeId: storeId,
      storeName: storeName,
    },
  });
};

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  const payload: GetAllStoresQuery = {};
  await store.stores.getAllStores(payload);
  $q.loading.hide();
});
</script>
<template>
  <q-page class="tw-py-8 tw-px-4">
    <template v-if="!selectedStoreId && store.auth.userRole != USER_ROLE.STORE_MANAGER">
      <div class="tw-flex tw-w-full tw-items-center">
        <span
          class="text-grey-10 tw-font-bold"
          :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
          >Daftar Toko</span
        >
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
      <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

      <q-input
        v-model="nameFilter"
        outlined
        label="Cari Toko"
        class="tw-mt-4 text-body-medium"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-4' : 'tw-mb-12'"
      />
      <q-card flat bordered>
        <template v-if="filteredStores && filteredStores.length">
          <template v-for="(store, idx) in filteredStores" :key="store.id">
            <q-card-section
              class="tw-cursor-pointer card-content tw-p-0 text-grey-10"
              @click="onClickStoreName(store.id, store.name)"
            >
              <p
                class="text-body-large tw-mb-0 tw-py-4 tw-px-4"
                :class="$q.screen.lt.sm ? 'text-mobile' : ''"
              >
                {{ idx + 1 }}. {{ store.name }}
              </p>
            </q-card-section>
            <q-separator
              v-if="
                filteredStores.length > 1 && idx != filteredStores.length - 1
              "
            />
          </template>
        </template>
        <div v-else class="full-width row flex-center q-gutter-sm q-pa-xl">
          <span class="text-h6"> Tidak ada toko </span>
          <q-icon size="2em" name="sentiment_dissatisfied" />
        </div>
      </q-card>

      <AddNewStoreModal
        v-if="showAddNewStoreModal"
        v-model="showAddNewStoreModal"
      />
    </template>
    <template v-else>
      <ManageStoreDetails
        :store-id="selectedStoreId"
        :store-name="selectedStoreName"
      />
    </template>
  </q-page>
</template>
<style scoped lang="scss">
.card-content {
  :hover {
    background-color: $grey-4;
  }
}
</style>

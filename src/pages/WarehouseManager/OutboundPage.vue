<script setup lang="ts">
import { useStore } from "src/stores";
import type { GetAllOutboundsQuery } from "src/stores/product/types";
import AddNewOutboundModal from "src/components/Modal/AddNewOutboundModal.vue";
import OutboundTable from "src/components/Table/OutboundTable.vue";

const $q = useQuasar();
const store = useStore();
const outbounds = computed(() => store.products.outbounds ?? []);

const showAddNewOutboundModal = ref(false);
const page = ref(1);

onMounted(async () => {
  $q.loading.show({
    message: "Loading...",
  });
  await store.stores.getAllStores();

  const req: GetAllOutboundsQuery = {
    page: 1,
    limit: 10,
  };

  await store.products.getAllOutbounds(req);

  await store.products.getAllProducts();
  $q.loading.hide();
});
</script>
<template>
  <q-page class="tw-py-8 tw-px-4">
    <div class="tw-flex tw-w-full tw-items-center">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >Daftar Pengeluaran Barang</span
      >
      <q-space />
    </div>
    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <q-card flat bordered class="tw-border-2 tw-mt-8 tw-pb-2 card-container">
      <div
        class="tw-flex tw-items-center tw-p-4"
        :class="$q.screen.lt.sm ? 'text-mobile tw-mb-2' : 'tw-mb-4'"
      >
        <span
          class="text-grey-10 tw-font-bold text-body-large"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          >Informasi Pengeluaran Barang</span
        >
        <q-space />
        <q-btn
          no-caps
          :label="$q.screen.lt.sm ? '' : 'Tambah Pengeluaran'"
          icon="add"
          @click="showAddNewOutboundModal = true"
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          class="tw-rounded-3xl"
          color="primary"
        />
      </div>

      <OutboundTable
        :outbounds="outbounds"
        :total-pages="store.products.outboundsMeta?.total_page ?? 0"
        :total-data="store.products.outboundsMeta?.total_item ?? 0"
        :rows-per-page="10"
        v-model="page"
        is-editable
      />

      <AddNewOutboundModal
        v-model="showAddNewOutboundModal"
        :store-id="''"
        :store-name="''"
      />
    </q-card>
  </q-page>
</template>
<style scoped lang="scss"></style>

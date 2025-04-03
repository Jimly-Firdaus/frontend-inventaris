<script setup lang="ts">
import { useStore } from "src/stores";
// import { QTableProps } from "quasar";
import InboundTable from "src/components/Table/InboundTable.vue";
import OutboundTable from "src/components/Table/OutboundTable.vue";

const store = useStore();
const inbounds = computed(() => store.products.inbounds);
const outbounds = computed(() => store.products.outbounds);

const currentTab = ref("inbound");

onMounted(() => {
  if (!inbounds.value.length) {
    store.products.getAllInbounds();
  }

  if (!store.products.outbounds.length) {
    store.products.getAllOutbounds();
  }
});
</script>
<template>
  <q-page class="tw-px-4 tw-py-8">
    <div class="tw-flex tw-w-full tw-items-center">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >Daftar Transaksi Barang</span
      >
      <q-space />
    </div>
    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <q-tabs v-model="currentTab" align="left" class="tw-mb-4">
      <q-tab no-caps class="tab-content" name="inbound" label="Pemasukan" />
      <q-tab no-caps class="tab-content" name="outbound" label="Pengeluaran" />
    </q-tabs>

    <InboundTable v-if="currentTab == 'inbound'" :inbounds="inbounds" />
    <OutboundTable v-else :outbounds="outbounds" />
  </q-page>
</template>
<style scoped lang="scss">
.tab-content {
  :deep(.q-tab__label) {
    font-size: 20px;
    line-height: 24px;
    @media (max-width: 600px) {
      font-size: 18px;
      line-height: 20px;
    }
  }
}
</style>

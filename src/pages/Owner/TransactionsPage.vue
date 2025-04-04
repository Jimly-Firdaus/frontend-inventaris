<script setup lang="ts">
import { useStore } from "src/stores";
// import { QTableProps } from "quasar";
import InboundTable from "src/components/Table/InboundTable.vue";
import OutboundTable from "src/components/Table/OutboundTable.vue";
import { USER_ROLE } from "src/constants/user";
import type {
  GetAllInboundsQuery,
  GetAllOutboundsQuery,
} from "src/stores/product/types";

const store = useStore();
const inbounds = computed(() => store.products.inbounds ?? []);
const outbounds = computed(() => store.products.outbounds ?? []);

const currentTab = ref("inbound");

const page = ref(1);

const refreshData = async () => {
  if (currentTab.value == "inbound") {
    const req: GetAllInboundsQuery = {
      page: page.value,
      limit: 10,
    };
    await store.products.getAllInbounds(req);
  } else {
    const req: GetAllOutboundsQuery = {
      page: page.value,
      limit: 10,
    };
    await store.products.getAllOutbounds(req);
  }
};

watch(page, async () => {
  await refreshData();
});

watch(currentTab, async () => {
  page.value = 1;
  await refreshData();
});

onMounted(async () => {
  page.value = 1;
  if (store.auth.user) {
    if (store.auth.userRole == USER_ROLE.STORE_MANAGER)
      currentTab.value = "outbound";
  }

  if (store.auth.userRole) {
    if (
      !inbounds.value.length &&
      [USER_ROLE.OWNER, USER_ROLE.WAREHOUSE_MANAGER].includes(
        store.auth.userRole,
      )
    ) {
      const req: GetAllInboundsQuery = {
        page: page.value,
        limit: 10,
      };
      await store.products.getAllInbounds(req);
    }

    if (
      !outbounds.value.length &&
      [USER_ROLE.OWNER, USER_ROLE.STORE_MANAGER].includes(store.auth.userRole)
    ) {
      const req: GetAllOutboundsQuery = {
        page: page.value,
        limit: 10,
      };
      await store.products.getAllOutbounds(req);
    }
  }
});
</script>
<template>
  <q-page class="tw-px-4 tw-py-8">
    <div class="tw-flex tw-w-full tw-items-center">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >{{
          store.auth.userRole == USER_ROLE.OWNER
            ? "Daftar Transaksi Barang"
            : store.auth.userRole == USER_ROLE.STORE_MANAGER
              ? "Daftar Pengeluaran Barang"
              : "Daftar Pemasukan Barang"
        }}</span
      >
      <q-space />
    </div>
    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <q-tabs
      v-if="store.auth.userRole == USER_ROLE.OWNER"
      v-model="currentTab"
      align="left"
      class="tw-mb-4"
    >
      <q-tab no-caps class="tab-content" name="inbound" label="Pemasukan" />
      <q-tab no-caps class="tab-content" name="outbound" label="Pengeluaran" />
    </q-tabs>

    <InboundTable
      v-if="currentTab == 'inbound'"
      :inbounds="inbounds"
      :total-pages="store.products.inboundsMeta?.total_page ?? 0"
      :total-data="store.products.inboundsMeta?.total_item ?? 0"
      :rows-per-page="10"
      v-model="page"
    />
    <OutboundTable
      v-else
      :outbounds="outbounds"
      :total-pages="store.products.outboundsMeta?.total_page ?? 0"
      :total-data="store.products.outboundsMeta?.total_item ?? 0"
      :rows-per-page="10"
      v-model="page"
    />
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

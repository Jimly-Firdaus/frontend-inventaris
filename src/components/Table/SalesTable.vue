<script setup lang="ts">
import type { QTableProps } from "quasar";
import type {
  GetAllInvoiceResponseData,
  InvoiceItem,
} from "src/stores/store/types";
import {
  type PRODUCT_PRICE_TYPE,
  PRODUCT_PRICE_TYPE_LABEL,
} from "src/constants/price";
// import { DateTime } from "luxon";
import { formatWithThousandSeparator } from "src/util/number";
import UpdateOrAddInvoiceItemModal from "src/components/Modal/UpdateOrAddInvoiceItemModal.vue";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { useStore } from "src/stores";
import { AxiosError } from "axios";

const props = defineProps({
  invoices: {
    type: Array as PropType<GetAllInvoiceResponseData[]>,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalData: Number,
  rowsPerPage: {
    type: Number,
    required: true,
  },
  loading: Boolean,
  isEditable: Boolean,
});

const $q = useQuasar();
const store = useStore();

const page = defineModel<number>({ required: true });

const invoiceColumns: QTableProps["columns"] = [
  {
    name: "customer_name",
    align: "left",
    label: "Nama Pembeli",
    field: "customer_name",
  },
  {
    name: "created_at",
    align: "left",
    label: "Dibuat Pada",
    field: "created_at",
    sortable: true,
  },
  {
    name: "delete_invoice",
    align: "left",
    label: "",
    field: "delete_invoice",
  },
];

const invoiceItemsColumns: QTableProps["columns"] = [
  {
    name: "product_name",
    align: "left",
    label: "Nama Barang",
    field: "product_name",
  },
  {
    name: "quantity",
    align: "left",
    label: "Quantity",
    field: "quantity",
    sortable: true,
  },
  {
    name: "price_type",
    align: "left",
    label: "Harga Jual",
    field: "price_type",
  },
  {
    name: "tiktok_payment_amount",
    align: "left",
    label: "Tiktok",
    field: "tiktok_payment_amount",
  },
  {
    name: "shopee_payment_amount",
    label: "Shopee",
    field: "shopee_payment_amount",
    sortable: false,
  },
  {
    name: "transfer_payment_amount",
    label: "Transfer",
    field: "transfer_payment_amount",
  },
  {
    name: "remaining_payment_amount",
    label: "Sisa Pembayaran",
    field: "remaining_payment_amount",
    sortable: false,
  },
  {
    name: "action",
    label: "",
    field: "action",
    sortable: false,
  },
];

// Expanded control
const expanded = ref<string[]>([]);

const showConfirmationModal = ref(false);
const isDeletingInvoice = ref(false);

const selectedInvoice = ref<GetAllInvoiceResponseData>();

// Invoice item update modal
const showUpdateInvoiceItemModal = ref(false);
const selectedInvoiceItem = ref<InvoiceItem>();
const isUpdatingInvoiceItem = ref(false);

const onEditInvoiceItems = (invoiceItem: InvoiceItem) => {
  selectedInvoiceItem.value = invoiceItem;
  isUpdatingInvoiceItem.value = true;
  showUpdateInvoiceItemModal.value = true;
  console.log("[EDIT] invoice item ", invoiceItem);
};
const onDeleteInvoiceItems = () => {
  console.log("[EDIT] invoice item ", selectedInvoiceItem.value);
  if (selectedInvoiceItem.value) {
    try {
      store.stores.deleteInvoiceItem(selectedInvoiceItem.value.id);
      console.log("[EDIT] invoice item ", selectedInvoiceItem.value);

      $q.notify({
        message: "Berhasil menghapus data invoice!",
        color: "primary",
        classes: "q-notify-font",
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        $q.notify({
          message: `Terjadi kesalahan saat menghapus data invoice: ${err.response.data.message}`,
          color: "negative",
          classes: "q-notify-font",
        });
      } else if (err instanceof Error) {
        $q.notify({
          message: `Terjadi kesalahan saat menghapus data invoice: ${err.message}`,
          color: "negative",
          classes: "q-notify-font",
        });
      }
    }
  }
};

const onDeleteInvoice = () => {
  console.log("[EDIT] invoice ", selectedInvoice.value);
  if (selectedInvoice.value) {
    try {
      store.stores.deleteInvoice(selectedInvoice.value.id);

      $q.notify({
        message: "Berhasil menghapus invoice!",
        color: "primary",
        classes: "q-notify-font",
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        $q.notify({
          message: `Terjadi kesalahan saat menghapus invoice: ${err.response.data.message}`,
          color: "negative",
          classes: "q-notify-font",
        });
      } else if (err instanceof Error) {
        $q.notify({
          message: `Terjadi kesalahan saat menghapus invoice: ${err.message}`,
          color: "negative",
          classes: "q-notify-font",
        });
      }
    }
  }
};

const onAddInvoiceItem = () => {
  isUpdatingInvoiceItem.value = false;
  showUpdateInvoiceItemModal.value = true;
};

onMounted(async () => {
  await store.products.getAllProducts();
});
</script>
<template>
  <q-table
    flat
    virtual-scroll
    hide-pagination
    bordered
    :rows="props.invoices"
    :columns="invoiceColumns"
    :rows-per-page-options="[0]"
    :loading="props.loading"
    v-model:expanded="expanded"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr
        :props="props"
        class="tw-cursor-pointer"
        @click="props.expand = !props.expand"
      >
        <q-td auto-width>
          <q-btn
            size="sm"
            color="primary"
            round
            dense
            flat
            :icon="props.expand ? 'expand_less' : 'expand_more'"
          />
        </q-td>
        <q-td key="customer_name" :props="props">
          {{ props.row.customer_name }}
        </q-td>
        <q-td key="created_at" :props="props">
          {{ props.row.created_at }}
        </q-td>
        <q-td key="delete_invoice" :props="props">
          <q-btn
            dense
            outline
            unelevated
            no-caps
            icon="delete_forever"
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
            :label="$q.screen.lt.sm ? '' : 'Hapus'"
            @click="
              selectedInvoice = props.row;
              isDeletingInvoice = true;
              showConfirmationModal = true;
            "
          />
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" class="bg-grey-4">
        <q-td colspan="100%">
          <div class="q-gutter-md tw-w-full">
            <q-table
              :rows="props.row.invoice_items"
              :columns="invoiceItemsColumns"
              dense
              flat
              hide-pagination
              virtual-scroll
              bordered
              class=""
            >
              <template v-slot:body="itemProps">
                <q-tr :props="itemProps">
                  <q-td key="product_name" :props="itemProps">
                    {{ itemProps.row.product_name }}
                  </q-td>
                  <q-td key="quantity" :props="itemProps">
                    {{ itemProps.row.quantity }}
                  </q-td>
                  <q-td key="price_type" :props="itemProps">
                    {{
                      PRODUCT_PRICE_TYPE_LABEL[
                        itemProps.row.price_type as PRODUCT_PRICE_TYPE
                      ]
                    }}
                  </q-td>
                  <q-td key="tiktok_payment_amount" :props="itemProps">
                    {{
                      formatWithThousandSeparator(
                        itemProps.row.tiktok_payment_amount,
                      )
                    }}
                  </q-td>
                  <q-td key="shopee_payment_amount" :props="itemProps">
                    {{
                      formatWithThousandSeparator(
                        itemProps.row.shopee_payment_amount,
                      )
                    }}
                  </q-td>
                  <q-td key="transfer_payment_amount" :props="itemProps">
                    {{
                      formatWithThousandSeparator(
                        itemProps.row.transfer_payment_amount,
                      )
                    }}
                  </q-td>
                  <q-td key="remaining_payment_amount" :props="itemProps">
                    {{
                      formatWithThousandSeparator(
                        itemProps.row.price * itemProps.row.quantity -
                          (itemProps.row.tiktok_payment_amount +
                            itemProps.row.shopee_payment_amount +
                            itemProps.row.transfer_payment_amount),
                      )
                    }}
                  </q-td>
                  <q-td key="action" :props="itemProps">
                    <q-btn color="primary" flat icon="more_vert">
                      <q-menu>
                        <q-list style="min-width: 100px">
                          <q-item
                            clickable
                            v-close-popup
                            @click="onEditInvoiceItems(itemProps.row)"
                          >
                            <q-item-section>Ubah</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="
                              selectedInvoiceItem = itemProps.row;
                              isDeletingInvoice = false;
                              showConfirmationModal = true;
                            "
                          >
                            <q-item-section>Hapus</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
              <template #no-data>
                <div class="full-width row flex-center q-gutter-sm q-pa-xl">
                  <span class="text-h6"> Tidak ada data </span>
                  <q-icon size="2em" name="sentiment_dissatisfied" />
                </div>
              </template>
            </q-table>
          </div>

          <div class="row justify-center tw-py-2">
            <q-btn
              unelevated
              color="primary"
              no-caps
              label="Tambah Barang"
              icon="add"
              class="tw-rounded-3xl"
              @click="
                selectedInvoice = props.row;
                onAddInvoiceItem();
              "
            />
          </div>
          <q-separator size="1px" class="tw-my-2" color="primary" />
        </q-td>
      </q-tr>
    </template>
    <template #no-data>
      <div class="full-width row flex-center q-gutter-sm q-pa-xl">
        <span class="text-h6"> Tidak ada data </span>
        <q-icon size="2em" name="sentiment_dissatisfied" />
      </div>
    </template>
  </q-table>
  <div
    v-if="props.totalPages > 1"
    class="tw-flex tw-flex-col tw-items-center tw-justify-center"
  >
    <div class="tw-flex tw-w-full">
      <q-space />
      <div
        v-if="props.totalData"
        class="tw-text-sm tw-text-gray-500 tw-mt-2 tw-text-center"
      >
        {{ (page - 1) * props.rowsPerPage + 1 }}–{{
          Math.min(page * props.rowsPerPage, props.invoices.length) +
          (page - 1) * props.rowsPerPage
        }}
        dari {{ totalData }} data
      </div>
    </div>
    <q-pagination
      v-model="page"
      class="text-grey-9"
      :max="totalPages"
      :max-pages="1"
      direction-links
      flat
      color="grey-7"
      active-color="grey-9"
    />
  </div>
  <UpdateOrAddInvoiceItemModal
    v-if="showUpdateInvoiceItemModal"
    v-model="showUpdateInvoiceItemModal"
    :invoice-item="selectedInvoiceItem"
    :invoice-id="selectedInvoice?.id ?? ''"
    :is-update="isUpdatingInvoiceItem"
  />
  <ConfirmationModal
    :copy-text="`Apakah Anda yakin ingin menghapus${isDeletingInvoice ? '' : ' data'} invoice?`"
    v-model="showConfirmationModal"
    @continue="isDeletingInvoice ? onDeleteInvoice() : onDeleteInvoiceItems()"
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

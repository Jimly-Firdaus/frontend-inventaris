<script setup lang="ts">
import { useStore } from "src/stores";
import type { UpdateProductRequest } from "src/stores/product/types";
import { useRouter } from "vue-router";
import BackButton from "src/components/Button/BackButton.vue";
import ConfirmationModal from "src/components/Modal/ConfirmationModal.vue";
import { AxiosError } from "axios";
import { USER_ROLE } from "src/constants/user";

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const store = useStore();
const router = useRouter();
const allProducts = computed(() => store.products.products);

const showConfirmationModal = ref(false);
const isWarningTypeConfirmationModal = ref(false);
const confirmationModalCopy = computed(() =>
  isWarningTypeConfirmationModal.value
    ? "Apakah Anda yakin ingin menghapus barang ini?"
    : "Apakah Anda yakin ingin memperbarui data barang ini?",
);

const selectedProduct = computed(() =>
  allProducts.value.find((p) => p.id == props.productId),
);
const productPrice = ref({
  name: "",
  buyPrice: "",
  wholesaleSellPrice: "",
  retailSellPrice: "",
});

const onSaveProductChanges = async () => {
  try {
    $q.loading.show({
      message: "Loading...",
    });
    const req = {
      name: productPrice.value.name,
      buy_price:
        Number(productPrice.value.buyPrice) === 0
          ? undefined
          : Number(productPrice.value.buyPrice),
      wholesale_sell_price:
        Number(productPrice.value.wholesaleSellPrice) === 0
          ? undefined
          : Number(productPrice.value.wholesaleSellPrice),
      retail_sell_price:
        Number(productPrice.value.retailSellPrice) === 0
          ? undefined
          : Number(productPrice.value.retailSellPrice),
    } as UpdateProductRequest;

    await store.products.updateProduct(props.productId, req);

    $q.notify({
      message: "Berhasil mengubah barang!",
      color: "primary",
      classes: "q-notify-font",
    });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof AxiosError && err.response?.data?.message) {
      $q.notify({
        message: `Terjadi kesalahan saat mengubah barang: ${err.response.data.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    } else if (err instanceof Error) {
      $q.notify({
        message: `Terjadi kesalahan saat mengubah barang: ${err.message}`,
        color: "negative",
        classes: "q-notify-font",
      });
    }
  } finally {
    $q.loading.hide();
  }
};

const onConfirm = async () => {
  if (isWarningTypeConfirmationModal.value) {
    try {
      $q.loading.show({
        message: "Loading...",
      });
      await store.products.deleteProduct(props.productId);

      $q.notify({
        message: "Berhasil menghapus barang!",
        color: "primary",
        classes: "q-notify-font",
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        $q.notify({
          message: `Terjadi kesalahan saat menghapus barang: ${err.response.data.message}`,
          color: "negative",
          classes: "q-notify-font",
        });
      } else if (err instanceof Error) {
        $q.notify({
          message: `Terjadi kesalahan saat menghapus barang: ${err.message}`,
          color: "negative",
          classes: "q-notify-font",
        });
      }
    } finally {
      $q.loading.hide();
      await router.replace({
        query: {
          productId: undefined,
        },
      });
    }
  } else await onSaveProductChanges();
};

onMounted(async () => {
  if (!allProducts.value.length) await store.products.getAllProducts();

  productPrice.value = {
    name: selectedProduct.value?.name ?? "",
    buyPrice: selectedProduct.value?.buy_price ?? "",
    wholesaleSellPrice: selectedProduct.value?.wholesale_sell_price ?? "",
    retailSellPrice: selectedProduct.value?.retail_sell_price ?? "",
  };
});
</script>
<template>
  <div>
    <BackButton is-remove-route-query />
    <div class="tw-flex tw-w-full tw-items-center tw-mt-4">
      <span
        class="text-grey-10 tw-font-bold"
        :class="$q.screen.lt.sm ? 'text-h6' : 'text-h4'"
        >Detail Informasi Barang</span
      >
      <q-space />
    </div>
    <q-separator size="1px" class="tw-mb-10 tw-mt-2" color="primary" />

    <q-card flat bordered class="tw-border-2 tw-p-4 card-container tw-w-fit">
      <q-card-section>
        <div
          class="tw-flex tw-items-center text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          Nama Barang:
          <q-input
            dense
            outlined
            v-model="productPrice.name"
            class="tw-ml-2 text-body-medium"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <p
          class="text-body-medium tw-mb-0"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          Total Stok Barang: {{ selectedProduct?.stock }}
        </p>
      </q-card-section>
      <q-card-section v-if="store.auth.userRole == USER_ROLE.OWNER">
        <div
          class="tw-flex tw-items-center text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          Modal Barang:
          <q-input
            dense
            outlined
            v-model="productPrice.buyPrice"
            class="tw-ml-2 text-body-medium"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
            type="number"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div
          class="tw-flex tw-items-center text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          Harga Grosir Barang:
          <q-input
            dense
            outlined
            v-model="productPrice.wholesaleSellPrice"
            class="tw-ml-2 text-body-medium"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
            type="number"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div
          class="tw-flex tw-items-center text-body-medium"
          :class="$q.screen.lt.sm ? 'text-mobile' : ''"
        >
          Harga Eceran Barang:
          <q-input
            dense
            outlined
            v-model="productPrice.retailSellPrice"
            class="tw-ml-2 text-body-medium"
            :class="$q.screen.lt.sm ? 'text-mobile' : ''"
            type="number"
          />
        </div>
      </q-card-section>
    </q-card>

    <div class="tw-mt-4 row tw-gap-x-4">
      <q-btn
        unelevated
        no-caps
        label="Hapus"
        color="negative"
        @click="
          showConfirmationModal = true;
          isWarningTypeConfirmationModal = true;
        "
        :size="$q.screen.lt.sm ? 'md' : 'lg'"
      />
      <q-btn
        outline
        no-caps
        label="Simpan"
        @click="
          showConfirmationModal = true;
          isWarningTypeConfirmationModal = false;
        "
        :size="$q.screen.lt.sm ? 'md' : 'lg'"
      />
    </div>
    <ConfirmationModal
      :copy-text="confirmationModalCopy"
      v-model="showConfirmationModal"
      :is-warning="isWarningTypeConfirmationModal"
      @continue="onConfirm"
    />
    <!-- <AddProductStockModal
      v-if="showAddProductStockModal"
      v-model="showAddProductStockModal"
      :product-id="props.productId"
    /> -->
  </div>
</template>
<style scoped lang="scss">
.card-container {
  border-color: $grey-6;
  border-radius: 24px;
}
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
:deep(input[type="number"]) {
  -moz-appearance: textfield;
}
</style>

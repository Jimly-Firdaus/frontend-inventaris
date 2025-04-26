import { api } from "boot/axios";
import { defineStore } from "pinia";
import type {
  GetAllStoresQuery,
  GetAllStoresResponseData,
  GetAllStoresResponse,
  CreateStoreRequest,
  PaginationMeta,
  GetOutboundInsightQuery,
  OutboundInsight,
  GetAllInvoiceResponseData,
  InvoiceItem,
} from "./types";
import { PRODUCT_PRICE_TYPE } from "src/constants/price";
import type { AxiosResponse } from "axios";
import type { GetAllProductsQuery, GetAllProductsResponse, GetAllProductsResponseData } from "src/stores/product/types";

export const useStoresStore = defineStore("stores", () => {
  const stores = ref<GetAllStoresResponseData[]>([]);
  const storesMeta = ref<PaginationMeta>();
  const storeInsights = ref<{ [storeId: string]: OutboundInsight }>({});
  const invoices = ref<GetAllInvoiceResponseData[]>([]);
  const invoicesMeta = ref<PaginationMeta>();

  const storeProducts = ref<GetAllProductsResponseData[]>([])
  const storeProductsMeta = ref<PaginationMeta>();

  const getAllInvoices = (storeId?: string) => {
    console.log(storeId);
    invoices.value = [
      {
        id: "inv-001",
        created_at: "2025-04-26T10:00:00Z",
        customer_name: "Andy",
        invoice_items: [
          {
            id: "item-001",
            invoice_id: "inv-001",
            product_id: "prod-001",
            product_name: "Product A",
            quantity: 2,
            price: 5000,
            price_type: PRODUCT_PRICE_TYPE.RETAIL,
            tiktok_payment_amount: 0,
            shopee_payment_amount: 0,
            transfer_payment_amount: 0,
          },
          {
            id: "item-002",
            invoice_id: "inv-001",
            product_id: "prod-002",
            product_name: "Product B",
            quantity: 1,
            price: 8000,
            price_type: PRODUCT_PRICE_TYPE.WHOLESALE,
            tiktok_payment_amount: 0,
            shopee_payment_amount: 0,
            transfer_payment_amount: 0,
          },
        ],
      },
      {
        id: "inv-002",
        created_at: "2025-04-26T11:00:00Z",
        customer_name: "Budi",
        invoice_items: [
          {
            id: "item-003",
            invoice_id: "inv-002",
            product_id: "prod-003",
            product_name: "Product C",
            quantity: 5,
            price: 4000,
            price_type: PRODUCT_PRICE_TYPE.RETAIL,
            tiktok_payment_amount: 0,
            shopee_payment_amount: 0,
            transfer_payment_amount: 0,
          },
          {
            id: "item-004",
            invoice_id: "inv-002",
            product_id: "prod-004",
            product_name: "Product D",
            quantity: 3,
            price: 15000,
            price_type: PRODUCT_PRICE_TYPE.WHOLESALE,
            tiktok_payment_amount: 0,
            shopee_payment_amount: 0,
            transfer_payment_amount: 0,
          },
          {
            id: "item-005",
            invoice_id: "inv-002",
            product_id: "prod-005",
            product_name: "Product E",
            quantity: 4,
            price: 55000,
            price_type: PRODUCT_PRICE_TYPE.RETAIL,
            tiktok_payment_amount: 0,
            shopee_payment_amount: 0,
            transfer_payment_amount: 0,
          },
        ],
      },
      {
        id: "inv-003",
        created_at: "2025-04-26T12:00:00Z",
        customer_name: "Rocky",
        invoice_items: [
          {
            id: "item-006",
            invoice_id: "inv-003",
            product_id: "prod-006",
            product_name: "Product F",
            quantity: 1,
            price: 20000,
            price_type: PRODUCT_PRICE_TYPE.WHOLESALE,
            tiktok_payment_amount: 0,
            shopee_payment_amount: 0,
            transfer_payment_amount: 0,
          },
          {
            id: "item-007",
            invoice_id: "inv-003",
            product_id: "prod-007",
            product_name: "Product G",
            quantity: 6,
            price: 35000,
            price_type: PRODUCT_PRICE_TYPE.WHOLESALE,
            tiktok_payment_amount: 0,
            shopee_payment_amount: 0,
            transfer_payment_amount: 0,
          },
        ],
      },
    ];
  };

  const addInvoiceItem = (invoiceId: string, newInvoiceItem: InvoiceItem) => {
    const invoice = invoices.value.find((inv) => inv.id === invoiceId);
    if (!invoice) {
      console.error("Invoice not found");
      return;
    }

    invoice.invoice_items.push(newInvoiceItem);
  };

  const updateInvoiceItem = (
    invoiceItemId: string,
    invoiceId: string,
    updatedFields: Partial<InvoiceItem>,
  ) => {
    const invoice = invoices.value.find((inv) => inv.id === invoiceId);
    if (!invoice) {
      console.error("Invoice not found");
      return;
    }

    const item = invoice.invoice_items.find((it) => it.id === invoiceItemId);
    if (!item) {
      console.error("Invoice item not found");
      return;
    }

    Object.assign(item, updatedFields);
  };

  const deleteInvoiceItem = (invoiceItemId: string) => {
    invoices.value.forEach((invoice) => {
      invoice.invoice_items = invoice.invoice_items.filter(
        (item) => item.id !== invoiceItemId,
      );
    });
  };

  const deleteInvoice = (invoiceId: string) => {
    const index = invoices.value.findIndex((inv) => inv.id === invoiceId);
    if (index !== -1) {
      invoices.value.splice(index, 1);
    } else {
      console.error("Invoice not found");
    }
  };

  const getAllStoreProducts = async (payload?: GetAllProductsQuery) => {
    const res: AxiosResponse<{ data: GetAllProductsResponse }> = await api.get(
      "/stores/stock",
      {
        params: payload,
      },
    );

    storeProducts.value = res.data.data.data;
    storeProductsMeta.value = res.data.data.meta;
  };

  const getAllStores = async (payload?: GetAllStoresQuery) => {
    const res: AxiosResponse<{ data: GetAllStoresResponse }> = await api.get(
      "/stores",
      {
        params: payload,
      },
    );

    stores.value = res.data.data.data;
    storesMeta.value = res.data.data.meta;
  };

  const createNewStore = async (req: CreateStoreRequest) => {
    await api.post("/stores", req);

    await getAllStores();
  };

  const deleteStore = async (storeId: string) => {
    await api.delete(`/stores/${storeId}`);
  };

  const getInsight = async (req: GetOutboundInsightQuery) => {
    // if (storeInsights.value && storeInsights.value[req.store_id]) return storeInsights.value[req.store_id];

    const res: AxiosResponse<{ data: OutboundInsight }> = await api.get(
      "/outbounds/insight",
      {
        params: req,
      },
    );

    storeInsights.value[req.store_id] = res.data.data;
    return res.data.data;
  };

  return {
    stores,
    storeInsights,
    invoices,
    invoicesMeta,
    storeProducts,
    storeProductsMeta,

    getAllInvoices,

    addInvoiceItem,
    updateInvoiceItem,
    deleteInvoiceItem,
    deleteInvoice,

    getAllStoreProducts,
    getAllStores,
    createNewStore,
    deleteStore,
    getInsight,
  };
});

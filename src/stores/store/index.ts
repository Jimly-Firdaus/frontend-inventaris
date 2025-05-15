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
  Invoice,
  InvoiceItem,
  CreateInvoiceReq,
  CreateInvoiceItemReq,
  GetAllInvoicesQuery,
  GetAllInvoiceResponse,
  GetAllInvoiceItemsQuery,
  GetAllInvoiceItemsResponse,
} from "./types";
import type { AxiosResponse } from "axios";
import type {
  GetAllProductsQuery,
  GetAllProductsResponse,
  GetAllProductsResponseData,
} from "src/stores/product/types";

export const useStoresStore = defineStore("stores", () => {
  const stores = ref<GetAllStoresResponseData[]>([]);
  const storesMeta = ref<PaginationMeta>();
  const storeInsights = ref<{ [storeId: string]: OutboundInsight }>({});
  const invoices = ref<Invoice[]>([]);
  const invoicesMeta = ref<PaginationMeta>();

  const storeProducts = ref<GetAllProductsResponseData[]>([]);
  const storeProductsMeta = ref<PaginationMeta>();

  const getAllInvoices = async (req: GetAllInvoicesQuery) => {
    const res: AxiosResponse<{ data: GetAllInvoiceResponse }> = await api.get(
      `/invoices`,
      {
        params: req,
      },
    );

    invoices.value = res.data.data.data ?? [];
    invoicesMeta.value = res.data.data.meta;
  };

  const getAllInvoiceItems = async (
    invoiceId: string,
    req: GetAllInvoiceItemsQuery,
  ) => {
    const invoiceIdx = invoices.value.findIndex((i) => i.id === invoiceId);

    const res: AxiosResponse<{ data: GetAllInvoiceItemsResponse }> =
      await api.get(`/invoices/${invoiceId}/items`, {
        params: req,
      });

    const responseData = res.data?.data?.data?.[0];
    if (invoiceIdx !== -1 && invoices.value) {
      if (responseData?.invoice_id) {
        invoices.value[invoiceIdx]!.items = res.data.data.data;
      } else {
        invoices.value[invoiceIdx]!.items = [];
      }
    }
  };

  const addInvoiceItem = async (
    invoiceId: string,
    newInvoiceItemReq: CreateInvoiceItemReq,
  ) => {
    await api.post(`/invoices/${invoiceId}/items`, {
      items: [newInvoiceItemReq],
    });
    const req: GetAllInvoiceItemsQuery = {
      order_by: "created_at",
      asc: false,
    };
    await getAllInvoiceItems(invoiceId, req);
  };

  const addInvoice = async (newInvoiceReq: CreateInvoiceReq) => {
    await api.post(`/invoices`, newInvoiceReq);
  };

  const updateInvoice = async (invoiceId: string, newCustomerName: string) => {
    await api.patch(`/invoices/${invoiceId}`, {
      customer: newCustomerName,
    });
    const invoiceIdx = invoices.value.findIndex((i) => i.id === invoiceId);
    if (invoiceIdx !== -1 && invoices.value && invoices.value[invoiceIdx]) {
      invoices.value[invoiceIdx].customer = newCustomerName;
    }
  };

  const updateInvoiceItem = async (
    invoiceItemId: string,
    invoiceId: string,
    updatedFields: Partial<InvoiceItem>,
  ) => {
    try {
      await api.patch(
        `/invoices/${invoiceId}/items/${invoiceItemId}`,
        updatedFields,
      );
    } catch (error) {
      console.error("Failed to update invoice item:", error);
      throw error;
    }

    if (updatedFields?.quantity == 0) {
      deleteInvoiceItem(invoiceItemId);
    } else {
      const invoice = invoices.value.find((inv) => inv.id === invoiceId);
      if (!invoice) {
        console.error("Invoice not found");
        return;
      }

      const item = invoice.items?.find((it) => it.id === invoiceItemId);
      if (!item) {
        console.error("Invoice item not found");
        return;
      }

      Object.assign(item, updatedFields);
    }
  };

  const deleteInvoiceItem = (invoiceItemId: string) => {
    invoices.value.forEach((invoice) => {
      if (invoice.items)
        invoice.items = invoice.items?.filter(
          (item) => item.id !== invoiceItemId,
        );
    });
  };

  const deleteInvoice = async (invoiceId: string) => {
    await api.delete(`/invoices/${invoiceId}`);

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

    storeProducts.value = res.data.data.data ?? [];
    storeProductsMeta.value = res.data.data.meta;
  };

  const getAllStores = async (payload?: GetAllStoresQuery) => {
    const res: AxiosResponse<{ data: GetAllStoresResponse }> = await api.get(
      "/stores",
      {
        params: payload,
      },
    );

    stores.value = res.data.data.data ?? [];
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
    updateInvoice,
    addInvoice,
    deleteInvoice,

    getAllInvoiceItems,
    addInvoiceItem,
    updateInvoiceItem,
    deleteInvoiceItem,

    getAllStoreProducts,
    getAllStores,
    createNewStore,
    deleteStore,
    getInsight,
  };
});

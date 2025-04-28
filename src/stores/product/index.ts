import { defineStore } from "pinia";
import type {
  GetAllProductsResponseData,
  GetAllProductsQuery,
  CreateProductRequest,
  UpdateProductRequest,
  CreateInboundData,
  GetAllInboundsResponseData,
  CreateOutboundRequest,
  GetAllOutboundsResponseData,
  GetAllProductsResponse,
  GetAllOutboundsResponse,
  GetAllOutboundsQuery,
  GetAllInboundsResponse,
  GetAllInboundsQuery,
  CreateExpenseInsightReq,
  GetExpenseInsightResponse,
  GetInboundsInsightQuery,
  GetInboundsInsightResponse,
  InboundsInsight,
} from "./types";
import type { AxiosResponse } from "axios";
import type { PaginationMeta } from "../store/types";
import { api } from "src/boot/axios";

export const useProductsStore = defineStore("products", () => {
  const products = ref<GetAllProductsResponseData[]>([]);
  const productsMeta = ref<PaginationMeta>();

  const inbounds = ref<GetAllInboundsResponseData[]>([]);
  const inboundsMeta = ref<PaginationMeta>();

  const outbounds = ref<GetAllOutboundsResponseData[]>([]);
  const outboundsMeta = ref<PaginationMeta>();

  const expenseInsight = ref({
    operationalCost: 0,
    expeditionCost: 0,
  });

  const inboundsInsight = ref<InboundsInsight[]>([]);
  const inboundsInsightMeta = ref<PaginationMeta>();
  const inboundsInsightTotalCapital = ref(0);

  const getAllProducts = async (payload?: GetAllProductsQuery) => {
    const res: AxiosResponse<{ data: GetAllProductsResponse }> = await api.get(
      "/products",
      {
        params: payload,
      },
    );

    products.value = res.data.data.data ?? [];
    productsMeta.value = res.data.data.meta;
  };

  const createNewProduct = async (payload: CreateProductRequest) => {
    await api.post("/products", payload);
  };

  const updateProduct = async (
    productId: string,
    payload: UpdateProductRequest,
  ) => {
    const idx = products.value.findIndex((p) => p.id === productId);
    if (idx !== -1) {
      const current = products.value[idx];
      if (current) {
        const updates = Object.fromEntries(
          Object.entries(payload).filter(
            ([key, val]) =>
              val !== undefined && val !== current[key as keyof typeof current],
          ),
        );

        await api.patch(`/products/${productId}`, updates);
        products.value[idx] = {
          ...current,
          id: current.id,
          name: updates.name ?? current.name,
          updated_at: current.updated_at,
          ...updates,
        };
      }
    }
  };

  const deleteProduct = async (productId: string) => {
    await api.delete(`/products/${productId}`);
    products.value = products.value.filter((p) => p.id != productId);
  };

  const createProductInbound = async (payload: CreateInboundData) => {
    await api.post("/inbounds", payload);
  };

  const getAllInbounds = async (req?: GetAllInboundsQuery) => {
    const finalReq: GetAllInboundsQuery = {
      ...(req ?? {}),
      asc: false,
      order_by: "created_at",
    };

    const res: AxiosResponse<{ data: GetAllInboundsResponse }> = await api.get(
      "/inbounds",
      {
        params: finalReq,
      },
    );

    inbounds.value = res.data.data.data ?? [];
    inboundsMeta.value = res.data.data.meta;
  };

  const updateInbound = async (inboundId: string, quantity: number) => {
    await api.patch(`/inbounds/${inboundId}`, {
      quantity: quantity,
    });
  };

  const createProductOutbound = async (payload: CreateOutboundRequest) => {
    await api.post("/outbounds", payload);
  };

  const getAllOutbounds = async (req?: GetAllOutboundsQuery) => {
    const finalReq: GetAllOutboundsQuery = {
      ...(req ?? {}),
      asc: false,
      order_by: "created_at",
    };

    const res: AxiosResponse<{ data: GetAllOutboundsResponse }> = await api.get(
      "/outbounds",
      {
        params: finalReq,
      },
    );

    outbounds.value = res.data.data.data ?? [];
    outboundsMeta.value = res.data.data.meta;
  };

  const getAllOutboundsByStoreId = async (req: GetAllOutboundsQuery) => {
    const res: AxiosResponse<{ data: GetAllOutboundsResponse }> = await api.get(
      "/outbounds",
      {
        params: req,
      },
    );

    outbounds.value = res.data.data.data ?? [];
    outboundsMeta.value = res.data.data.meta;
  };

  const updateOutbound = async (outboundId: string, quantity: number) => {
    await api.patch(`/outbounds/${outboundId}`, {
      quantity: quantity,
    });
  };

  const createExpenseInsight = async (payload: CreateExpenseInsightReq) => {
    await api.post("/expenses", payload);
  };

  const getExpenseInsight = async (period: string) => {
    const res: AxiosResponse<{ data: GetExpenseInsightResponse }> =
      await api.get("/expenses", {
        params: {
          period: period,
        },
      });

    Object.assign(expenseInsight.value, {
      operationalCost: res.data.data?.operational ?? 0,
      expeditionCost: res.data.data?.expedition ?? 0,
    });
  };

  const getInboundsInsight = async (payload: GetInboundsInsightQuery) => {
    const res: AxiosResponse<{ data: GetInboundsInsightResponse }> =
      await api.get("/inbounds/aggregate", {
        params: payload,
      });

    inboundsInsight.value = res.data.data.data ?? [];
    inboundsInsightMeta.value = res.data.data.meta;
    inboundsInsightTotalCapital.value = Number(res.data.data.total ?? 0);
  };

  return {
    products,
    productsMeta,
    outbounds,
    outboundsMeta,
    inbounds,
    inboundsMeta,
    inboundsInsight,
    inboundsInsightMeta,
    inboundsInsightTotalCapital,

    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,

    createProductInbound,
    getAllInbounds,
    updateInbound,

    createProductOutbound,
    getAllOutbounds,
    getAllOutboundsByStoreId,
    updateOutbound,

    expenseInsight,
    createExpenseInsight,
    getExpenseInsight,
    getInboundsInsight,
  };
});

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
} from "./types";
import type { AxiosResponse } from "axios";

export const useStoresStore = defineStore("stores", () => {
  const stores = ref<GetAllStoresResponseData[]>([]);
  const storesMeta = ref<PaginationMeta>();
  const storeInsights = ref<{ [storeId: string]: OutboundInsight }>({});

  const getAllStores = async (payload?: GetAllStoresQuery) => {
    const res: AxiosResponse<{ data: GetAllStoresResponse }> = await api.get("/stores", {
      params: payload,
    });

    stores.value = res.data.data.data;
    storesMeta.value = res.data.data.meta;
  };

  const createNewStore = async (req: CreateStoreRequest) => {
    await api.post("/stores", req);

    await getAllStores();
  };

  const deleteStore = async (storeId: string) => {
    await api.delete(`/stores/${storeId}`);
  }

  const getInsight = async (req: GetOutboundInsightQuery) => {
    // if (storeInsights.value && storeInsights.value[req.store_id]) return storeInsights.value[req.store_id];

    const res: AxiosResponse<{ data: OutboundInsight }> = await api.get("/outbounds/insight", {
      params: req,
    })

    storeInsights.value[req.store_id] = res.data.data;
    console.log(storeInsights.value[req.store_id]);
    return res.data.data;
  }

  return {
    stores,
    storeInsights,

    getAllStores,
    createNewStore,
    deleteStore,
    getInsight,
  };
});

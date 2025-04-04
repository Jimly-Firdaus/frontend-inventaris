import { api } from "boot/axios";
import { defineStore } from "pinia";
import type {
  GetAllStoresQuery,
  GetAllStoresResponseData,
  GetAllStoresResponse,
  CreateStoreRequest,
  PaginationMeta,
} from "./types";
import type { AxiosResponse } from "axios";

export const useStoresStore = defineStore("stores", () => {
  const stores = ref<GetAllStoresResponseData[]>([]);
  const storesMeta = ref<PaginationMeta>();

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

  return {
    stores,

    getAllStores,
    createNewStore,
    deleteStore,
  };
});

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
    console.log(res);
    console.log(payload);
    // stores.value = [
    //   {
    //     id: "asdad",
    //     name: "Toko A",
    //     updated_at: "2025-04-02T10:00:00Z",
    //   },
    //   {
    //     id: "axaxaxa",
    //     name: "Toko B",
    //     updated_at: "2025-04-02T10:00:00Z",
    //   },
    // ];
    stores.value = res.data.data.data;
    storesMeta.value = res.data.data.meta;
  };

  const createNewStore = async (req: CreateStoreRequest) => {
    const res = await api.post("/stores", req);
    console.log(res)
    // const NewStore: GetAllStoresResponseData = {
    //   id: "axaxa",
    //   name: req.name,
    //   updated_at: "2025-04-02T10:00:00Z",
    // }

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

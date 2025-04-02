// import { api } from "boot/axios";
import { defineStore } from "pinia";
import type {
  GetAllStoresQuery,
  GetAllStoresResponseData,
  // GetAllStoresResponse,
  CreateStoreRequest,
} from "./types";

export const useStoresStore = defineStore("stores", () => {
  const stores = ref<GetAllStoresResponseData[]>([]);

  const getAllStores = (payload: GetAllStoresQuery) => {
    console.log(payload)
    stores.value = [
      {
        id: "asdad",
        name: "Toko A",
        updated_at: "2025-04-02T10:00:00Z",
      },
      {
        id: "axaxaxa",
        name: "Toko B",
        updated_at: "2025-04-02T10:00:00Z",
      },
    ];
  };

  const createNewStore = (req: CreateStoreRequest) => {
    const NewStore: GetAllStoresResponseData = {
      id: "axaxa",
      name: req.name,
      updated_at: "2025-04-02T10:00:00Z",
    }

    stores.value.push(NewStore);
  };

  return {
    stores,

    getAllStores,
    createNewStore,
  };
});

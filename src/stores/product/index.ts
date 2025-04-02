// import { api } from "boot/axios";
import { defineStore } from "pinia";
import type {
  GetAllProductsResponseData,
  GetAllProductsQuery,
  CreateProductRequest,
} from "./types";

export const useProductsStore = defineStore("products", () => {
  const products = ref<GetAllProductsResponseData[]>([]);

  const getAllProducts = (payload: GetAllProductsQuery) => {
    console.log(payload)
    products.value = [
      {
        id: "asdad",
        name: "Sabun A",
        buy_price: 12000,
        wholesale_sell_price: 12500,
        retail_sell_price: 14000,
        stock: 500,
        updated_at: "2025-04-02T10:00:00Z",
      },
      {
        id: "asdada",
        name: "Sikat Gigi",
        buy_price: 7500,
        wholesale_sell_price: 8000,
        retail_sell_price: 9000,
        stock: 100,
        updated_at: "2025-04-02T10:00:00Z",
      },
    ];
  };

  const createNewProduct = (req: CreateProductRequest) => {
    const newProduct: GetAllProductsResponseData = {
      id: "axaxa",
      name: req.name,
      updated_at: "2025-04-02T10:00:00Z",
    }

    products.value.push(newProduct);
  };

  return {
    products,

    getAllProducts,
    createNewProduct,
  };
});

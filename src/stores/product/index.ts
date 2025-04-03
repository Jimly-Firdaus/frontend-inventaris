// import { api } from "boot/axios";
import { defineStore } from "pinia";
import type {
  GetAllProductsResponseData,
  GetAllProductsQuery,
  CreateProductRequest,
  UpdateProductRequest,
} from "./types";

export const useProductsStore = defineStore("products", () => {
  const products = ref<GetAllProductsResponseData[]>([]);

  const getAllProducts = (payload: GetAllProductsQuery) => {
    console.log(payload);
    products.value = [
      {
        id: "asdad",
        name: "Sabun A",
        buy_price: "12000",
        wholesale_sell_price: "12500",
        retail_sell_price: "14000",
        stock: 500,
        updated_at: "2025-04-02T10:00:00Z",
      },
      {
        id: "asdada",
        name: "Sikat Gigi",
        buy_price: "7500",
        wholesale_sell_price: "8000",
        retail_sell_price: "9000",
        stock: 100,
        updated_at: "2025-04-02T10:00:00Z",
      },
    ];
  };

  const createNewProduct = (req: CreateProductRequest) => {
    const newProduct: GetAllProductsResponseData = {
      id: "axaxa",
      name: req.name,
      stock: req.stock,
      buy_price: req.buy_price,
      wholesale_sell_price: req.wholesale_sell_price,
      retail_sell_price: req.retail_sell_price,
      updated_at: "2025-04-02T10:00:00Z",
    };

    products.value.push(newProduct);
  };

  const updateProduct = (productId: string, payload: UpdateProductRequest) => {
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

        console.log("Updates", updates);
        // ensure required fields are explicitly included to avoid TS err
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

  const deleteProduct = (productId: string) => {
    products.value = products.value.filter((p) => p.id != productId);
  }

  return {
    products,

    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,
  };
});

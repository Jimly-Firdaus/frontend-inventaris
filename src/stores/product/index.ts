// import { api } from "boot/axios";
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
} from "./types";
import { PRODUCT_PRICE_TYPE } from "src/constants/price";

export const useProductsStore = defineStore("products", () => {
  const products = ref<GetAllProductsResponseData[]>([]);
  const inbounds = ref<GetAllInboundsResponseData[]>([]);
  const outbounds = ref<GetAllOutboundsResponseData[]>([]);

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

  const createProductInbound = (payload: CreateInboundData) => {
    const itemIdx = products.value.findIndex((p) => p.id == payload.product_id)
    if (itemIdx != -1) {
      const newDummy: GetAllInboundsResponseData = {
        id: 'inbound-004',
        product_id: payload.product_id,
        product_name: products.value[itemIdx]?.name ?? "Unknown",
        quantity: payload.quantity,
        created_by: 'admin',
        created_at: '2025-04-01T10:00:00Z',
        updated_by: 'admin',
        updated_at: '2025-04-01T10:00:00Z'
      }

      products.value[itemIdx]!.stock = (Number(products.value[itemIdx]?.stock) || 0) + Number(payload.quantity);

      inbounds.value.push(newDummy);
    }
  }

  const getAllInbounds = () => {
    const dummyInbounds: GetAllInboundsResponseData[] = [
      {
        id: 'inbound-001',
        product_id: 'prod-001',
        product_name: 'Susu Ultra Milk 1L',
        quantity: 50,
        created_by: 'admin',
        created_at: '2025-04-01T10:00:00Z',
        updated_by: 'admin',
        updated_at: '2025-04-01T10:00:00Z'
      },
      {
        id: 'inbound-002',
        product_id: 'prod-002',
        product_name: 'Indomie Goreng',
        quantity: 200,
        created_by: 'staff-1',
        created_at: '2025-04-02T08:30:00Z',
        updated_by: 'staff-1',
        updated_at: '2025-04-02T08:30:00Z'
      },
      {
        id: 'inbound-003',
        product_id: 'prod-003',
        product_name: 'Teh Botol Sosro 500ml',
        quantity: 120,
        created_by: 'staff-2',
        created_at: '2025-04-03T09:15:00Z',
        updated_by: 'staff-2',
        updated_at: '2025-04-03T09:15:00Z'
      }
    ];

    inbounds.value = dummyInbounds;
  }

  const createProductOutbound = (payload: CreateOutboundRequest) => {
    const itemIdx = products.value.findIndex((p) => p.id == payload.product_id)
    if (itemIdx != -1) {
      const newDummy: GetAllOutboundsResponseData = {
        id: 'outbound-004',
        product_id: payload.product_id,
        product_name: products.value[itemIdx]?.name ?? "Unknown",
        store_id: payload.store_id,
        store_name: payload.to,
        quantity: payload.quantity,
        price_type: payload.price_type,
        price: payload.price_type == PRODUCT_PRICE_TYPE.WHOLESALE ? (products.value[itemIdx]?.wholesale_sell_price ?? "") : (products.value[itemIdx]?.retail_sell_price ?? ""),
        created_by: 'admin',
        created_at: '2025-04-01T10:15:00Z',
        updated_by: 'admin',
        updated_at: '2025-04-01T10:15:00Z'
      }

      products.value[itemIdx]!.stock = (Number(products.value[itemIdx]?.stock) || 0) - Number(payload.quantity);

      outbounds.value.push(newDummy);
    }
  }

  const getAllOutbounds = () => {
    const dummyOutbounds: GetAllOutboundsResponseData[] = [
      {
        id: 'outbound-001',
        product_id: 'prod-001',
        product_name: 'Teh Botol Sosro',
        store_id: 'store-001',
        store_name: 'Toko Sumber Rejeki',
        quantity: 30,
        price_type: PRODUCT_PRICE_TYPE.WHOLESALE,
        price: '3500',
        created_by: 'admin',
        created_at: '2025-04-01T10:15:00Z',
        updated_by: 'admin',
        updated_at: '2025-04-01T10:15:00Z'
      },
      {
        id: 'outbound-002',
        product_id: 'prod-002',
        product_name: 'Indomie Kari Ayam',
        store_id: 'store-002',
        store_name: 'Warung Pak Slamet',
        quantity: 100,
        price_type: PRODUCT_PRICE_TYPE.RETAIL,
        price: '2800',
        created_by: 'staff-1',
        created_at: '2025-04-02T11:00:00Z',
        updated_by: 'staff-1',
        updated_at: '2025-04-02T11:00:00Z'
      },
      {
        id: 'outbound-003',
        product_id: 'prod-003',
        product_name: 'Ultra Milk Coklat 250ml',
        store_id: 'store-003',
        store_name: 'Minimarket Barokah',
        quantity: 50,
        price_type: PRODUCT_PRICE_TYPE.WHOLESALE,
        price: '4500',
        created_by: 'staff-2',
        created_at: '2025-04-03T14:30:00Z',
        updated_by: 'staff-2',
        updated_at: '2025-04-03T14:30:00Z'
      }
    ];

    outbounds.value = dummyOutbounds;
  }

  return {
    products,
    outbounds,
    inbounds,

    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct,

    createProductInbound,
    getAllInbounds,

    createProductOutbound,
    getAllOutbounds,
  };
});

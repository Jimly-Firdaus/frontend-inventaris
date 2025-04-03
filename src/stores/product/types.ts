import type { Pagination, Sort, PaginationMeta } from "../store/types";
import type { PRODUCT_PRICE_TYPE } from "src/constants/price";

export interface GetAllProductsQuery {
	name?: string;
	page?: number;
	limit?: number;
	order_by?: string;
	asc?: boolean;
}

export interface GetAllProductsFilter {
	name?: string;
	pagination?: Pagination;
	sort?: Sort;
}

export interface GetAllProductsResponseData {
	id: string;
  name: string;
  buy_price?: string | undefined;
  wholesale_sell_price?: string | undefined;
  retail_sell_price?: string | undefined;
  stock?: number;
  updated_at: string;
}

export interface GetAllProductsResponse {
	data: GetAllProductsResponseData
	meta?: PaginationMeta;
}

export interface CreateProductRequest {
	name: string;
  stock: number;
	buy_price?: string | undefined;
	wholesale_sell_price?: string | undefined;
	retail_sell_price?: string | undefined;
}

export interface UpdateProductRequest {
  name?: string;
	buy_price?: string;
  wholesale_sell_price?: string;
  retail_sell_price?: string;
}

export interface CreateInboundData {
	product_id: string;
  quantity: number;
}

export interface GetAllInboundsResponseData {
	id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

export interface CreateOutboundRequest {
	product_id: string;
  store_id: string;
	to: string;
	quantity: number
  price_type: PRODUCT_PRICE_TYPE;
}

export interface GetAllOutboundsResponseData {
  id: string;
  product_id: string;
  product_name: string;
  store_id: string;
  store_name: string;
  quantity: number;
  price_type: PRODUCT_PRICE_TYPE;
  price: string;
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}

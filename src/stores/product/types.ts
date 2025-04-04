import type { Pagination, Sort, PaginationMeta } from "../store/types";
import type { PRODUCT_PRICE_TYPE } from "src/constants/price";

export interface GetAllProductsQuery {
	name?: string | undefined;
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
	data: GetAllProductsResponseData[];
	meta?: PaginationMeta;
}

export interface CreateProductRequest {
	name: string;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
	buy_price?: number;
  wholesale_sell_price?: number;
  retail_sell_price?: number;
}

export interface CreateInboundData {
	product_id: string;
  quantity: number;
}

export interface GetAllInboundsQuery {
  product_name?: string;
  created_by_username?: string;
  updated_by_username?: string;
  quantity_lte?: number;
  quantity_gte?: number;
  created_at_lte?: string | undefined;
  created_at_gte?: string | undefined;
  page?: number;
	limit?: number;
  order_by?: string;
  asc?: boolean;

  price_type?: PRODUCT_PRICE_TYPE;
	store_name?: string;
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

export interface GetAllInboundsResponse {
  data: GetAllInboundsResponseData[];
  meta?: PaginationMeta;
}

export interface CreateOutboundRequest {
	product_id: string;
  store_name: string;
	to: string;
	quantity: number
  price_type: PRODUCT_PRICE_TYPE;
}

export interface GetAllOutboundsQuery {
	product_name?: string;
	store_name?: string;
  store_id?: string;
	quantity_lte?: number;
	quantity_gte?: number;
	price_type?: PRODUCT_PRICE_TYPE;
	price_lte?: number;
	price_gte?: number;
	created_at_lte?: string | undefined;
	created_at_gte?: string | undefined;
	created_by_username?: string;
	page?: number;
	limit?: number;
  order_by?: string;
  asc?: boolean;
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

export interface GetAllOutboundsResponse {
	data: GetAllOutboundsResponseData[];
	meta?: PaginationMeta;
}

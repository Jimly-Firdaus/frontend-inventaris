import type { Pagination, Sort, PaginationMeta } from "../store/types";

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
  buy_price?: number;
  wholesale_sell_price?: number;
  retail_sell_price?: number;
  stock?: number;
  updated_at: string;
}

export interface GetAllProductsResponse {
	data: GetAllProductsResponseData
	meta?: PaginationMeta;
}

export interface CreateProductRequest {
	name: string;
	buy_price?: number;
	wholesale_sell_price?: number;
	retail_sell_price?: number;
}

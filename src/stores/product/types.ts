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

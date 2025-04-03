export interface Pagination {
  page: number;
  limit: number;
}

export interface Sort {
  order_by: string;
  asc: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_item: number;
  total_page: number;
}

export interface GetAllStoresQuery {
  name?: string;
  page?: number;
  limit?: number;
  order_by?: string;
  asc?: boolean;
}

export interface GetAllStoresFilter {
  name?: string;
  pagination?: Pagination;
  sort?: Sort;
}

export interface GetAllStoresResponseData {
  id: string;
  name: string;
  updated_at: string;
}

export interface GetAllStoresResponse {
  data: GetAllStoresResponseData[];
  meta?: PaginationMeta;
}

export interface CreateStoreRequest {
  name: string;
}


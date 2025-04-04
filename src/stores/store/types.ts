import type { INSIGHT_INTERVAL } from "src/constants/time";

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

export interface GetOutboundInsightQuery {
  store_id: string;
  period: INSIGHT_INTERVAL;
  from: string;
  to: string;
}

export interface OutboundInsightDataItem {
  product_name: string;
  total_sold: number;
  total_retail_sold: number;
  total_wholesale_sold: number;
  avg_retail_price: string;
  avg_wholesale_price: string;
}

export interface OutboundInsightData {
  date: string;
  total_sold: number;
  total_retail_sold: number;
  total_wholesale_sold: number;
  total_revenue: string;
  total_retail_revenue: string;
  total_wholesale_revenue: string;
  items: OutboundInsightDataItem[];
}

export interface OutboundInsight {
  store_id: string;
  period: INSIGHT_INTERVAL;
  from: string;
  to: string;
  data: OutboundInsightData[];
}

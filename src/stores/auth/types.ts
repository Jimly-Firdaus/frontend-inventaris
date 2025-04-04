import type { USER_ROLE } from "src/constants/user";
import type { PaginationMeta } from "../store/types";

export interface User {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: USER_ROLE;
  store_id?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: USER_ROLE;
  store_id?: string | undefined;
  store_name?: string | undefined;
}

export interface GetAllUsersQuery {
  store_id?: string;
  page?: number;
  limit?: number;
  asc?: boolean;
  order_by?: string;
}

export interface GetUsersResponseData {
  id: string;
  username: string;
  role: USER_ROLE;
  store_name?: string | undefined;
  updated_at: string;
}

export interface GetUsersResponse {
  data: GetUsersResponseData[];
  meta: PaginationMeta;
}

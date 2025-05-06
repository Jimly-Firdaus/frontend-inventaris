import { api } from "boot/axios";
import { defineStore } from "pinia";
import type {
  LoginResponse,
  CreateUserRequest,
  GetUsersResponseData,
  GetAllUsersQuery,
  GetUsersResponse,
} from "./types";
import type { AxiosResponse } from "axios";
import type { PaginationMeta } from "../store/types";

export const useAuthStore = defineStore("auth", () => {
  const user = useLocalStorage<LoginResponse | null>("user", null, {
    serializer: {
      read: (v: string): LoginResponse | null => {
        try {
          return v ? (JSON.parse(v) as LoginResponse) : null;
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          return null;
        }
      },
      write: (v: LoginResponse | null): string => {
        return v ? JSON.stringify(v) : "";
      },
    },
  });
  const userRole = computed(() => user.value?.role);
  const accessToken = computed(() => user.value?.token);

  const users = ref<GetUsersResponseData[]>([]);
  const usersMeta = ref<PaginationMeta>();

  const storeManagers = ref<{ [storeId: string]: GetUsersResponseData[] }>({});
  const storeManagersMeta = ref<{ [storeId: string]: PaginationMeta }>({});

  const login = async (payload: { username: string; password: string }) => {
    const res: AxiosResponse<{ data: LoginResponse }> = await api.post(
      "/auth/login",
      payload,
    );
    user.value = res.data.data;
  };

  const logout = () => {
    user.value = null;
  };

  const updatePassword = async (userId: string, newPassword: string) => {
    await api.patch(`/users/${userId}`, {
      password: newPassword,
    });
  };

  const createNewUserAccount = async (payload: CreateUserRequest) => {
    await api.post("/users", payload);
  };

  const getAllUsers = async (req?: GetAllUsersQuery) => {
    const res: AxiosResponse<{ data: GetUsersResponse }> = await api.get(
      "/users",
      {
        params: req,
      },
    );

    users.value = res.data.data.data ?? [];
    usersMeta.value = res.data.data.meta;
  };

  const getAllStoreUsers = async (storeId: string) => {
    const res: AxiosResponse<{ data: GetUsersResponse }> = await api.get(
      "/users",
      {
        params: {
          store_id: storeId,
        },
      },
    );

    storeManagers.value[storeId] = res.data.data.data ?? [];
    storeManagersMeta.value[storeId] = res.data.data.meta;
  };

  const deleteUser = async (userId: string) => {
    await api.delete(`/users/${userId}`);

    users.value = users.value.filter((u) => u.id != userId);
  };

  return {
    user,
    users,
    usersMeta,
    userRole,
    accessToken,
    storeManagers,
    storeManagersMeta,

    login,
    logout,
    updatePassword,
    getAllUsers,
    getAllStoreUsers,
    createNewUserAccount,
    deleteUser,
  };
});

// import { api } from "boot/axios";
import { defineStore } from "pinia";
import type {
  LoginResponse,
  CreateUserRequest,
  GetUsersResponseData,
} from "./types";
import { USER_ROLE } from "src/constants/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<LoginResponse>();
  const users = ref<GetUsersResponseData[]>([]);
  const userRole = ref("");
  const login = (payload: { username: string; password: string }) => {
    console.log("LOGIN called", payload);
    user.value = {
      token: "random-token",
      role: USER_ROLE.OWNER,
    };
    userRole.value = user.value.role;
  };

  const logout = () => {
    user.value = undefined;
    userRole.value = "";
  };

  const createNewUserAccount = (payload: CreateUserRequest) => {
    const newUser: GetUsersResponseData = {
      id: "12112121",
      username: payload.username,
      role: payload.role,
      store_name: payload.store_name,
      updated_at: "2025-04-02T10:00:00Z",
    }

    users.value.push(newUser);
  };

  const getAllUsers = () => {
    const dummyUsers: GetUsersResponseData[] = [
      {
        id: "axaxa",
        username: "store_manager_one",
        role: USER_ROLE.STORE_MANAGER,
        updated_at: "2025-04-02T10:00:00Z",
        store_name: "Toko A",
      },
      {
        id: "adadada",
        username: "store_manager_two",
        role: USER_ROLE.STORE_MANAGER,
        updated_at: "2025-04-02T10:00:00Z",
        store_name: "Toko A",
      },
      {
        id: "acacaca",
        username: "store_manager_three",
        role: USER_ROLE.STORE_MANAGER,
        updated_at: "2025-04-02T10:00:00Z",
        store_name: "Toko B",
      },
      {
        id: "10101010",
        username: "warehouse_manager_one",
        role: USER_ROLE.WAREHOUSE_MANAGER,
        updated_at: "2025-04-02T10:00:00Z",
      },
      {
        id: "101010121210",
        username: "warehouse_manager_two",
        role: USER_ROLE.WAREHOUSE_MANAGER,
        updated_at: "2025-04-02T10:00:00Z",
      },
    ];

    users.value.push(...dummyUsers);
  };

  const getAllStoreUsers = (storeName: string) => {
    if (!users.value.length) getAllUsers();

    return users.value.filter((u) => u.store_name == storeName);
  };

  const deleteUser = (userId: string) => {
    users.value = users.value.filter(u => u.id != userId);
  }

  return {
    user,
    users,
    userRole,

    login,
    logout,
    getAllUsers,
    getAllStoreUsers,
    createNewUserAccount,
    deleteUser,
  };
});

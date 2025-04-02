// import { api } from "boot/axios";
import { defineStore } from "pinia";
import type { LoginResponse } from "./types";
import { USER_ROLE } from "src/constants/user";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<LoginResponse>();
  const userRole = ref("");
  const login = (payload: {
    username: string,
    password: string,
  }) => {
    console.log("LOGIN called", payload);
    user.value = {
      token: "random-token",
      role: USER_ROLE.OWNER,
    }
    userRole.value = user.value.role
  };

  const logout = () => {
    user.value = undefined;
    userRole.value = "";
  }

  return {
    user,
    userRole,

    login,
    logout,
  };
});


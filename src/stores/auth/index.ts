// import { api } from "boot/axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = {};
  const userRole = "owner";
  const login = (payload: {
    username: string,
    password: string,
  }) => {
    console.log("LOGIN called", payload);
  };

  return {
    user,
    userRole,

    login,
  };
});

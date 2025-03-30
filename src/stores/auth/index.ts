// import { api } from "boot/axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {

  const login = () => {
    console.log("LOGIN called");
  }

  return {
    login,
  }
})

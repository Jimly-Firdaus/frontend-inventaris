import { USER_ROLE } from "src/constants/user";

export interface User {
  username: string;
  password: string;
}

export interface LoginResponse {
	token: string;
	role: USER_ROLE;
}

import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  LoginPayload,
  LoginResponse,
  User,
} from "@/features/auth/auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await http.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await http.get<User>(ENDPOINTS.AUTH.ME);
    return data;
  },
};

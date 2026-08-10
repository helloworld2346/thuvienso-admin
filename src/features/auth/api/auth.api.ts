import axios from "axios";
import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  LoginPayload,
  LoginResult,
} from "@/features/auth/auth.types";
import type { ApiResponse } from "@/types/api";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResult> => {
    const { data } = await http.post<ApiResponse<LoginResult>>(
      ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return data.Result;
  },

  refresh: async (token: string): Promise<LoginResult> => {
    const { data } = await axios.post<ApiResponse<LoginResult>>(
      `${import.meta.env.VITE_API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
      { token },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data.Result;
  },

  logout: async (token: string): Promise<void> => {
    await http.post(ENDPOINTS.AUTH.LOGOUT, { token });
  },
};

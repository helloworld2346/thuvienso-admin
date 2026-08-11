import axios from "axios";
import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { LoginPayload, LoginResult } from "@/features/auth/auth.types";
import type { ApiResponse } from "@/types/api";
import { USE_MOCK, mock, mockDelay } from "@/api/mock";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResult> => {
    if (USE_MOCK) return mockDelay(mock.login());
    const { data } = await http.post<ApiResponse<LoginResult>>(
      ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return data.Result;
  },

  refresh: async (token: string): Promise<LoginResult> => {
    if (USE_MOCK) return mockDelay(mock.login());
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
    if (USE_MOCK) return mockDelay(undefined);
    await http.post(ENDPOINTS.AUTH.LOGOUT, { token });
  },
};

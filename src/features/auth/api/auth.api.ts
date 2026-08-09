import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  ApiResponse,
  LoginPayload,
  LoginResult,
} from "@/features/auth/auth.types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResult> => {
    const { data } = await http.post<ApiResponse<LoginResult>>(
      ENDPOINTS.AUTH.LOGIN,
      payload,
    );
    return data.Result;
  },
};

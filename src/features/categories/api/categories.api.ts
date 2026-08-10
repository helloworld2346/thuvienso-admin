import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Category,
  CategoryPayload,
} from "@/features/categories/categories.types";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await http.get<ApiResponse<Category[]>>(
      ENDPOINTS.CATEGORIES.GET_ALL,
    );
    return data.Result;
  },

  create: async (payload: CategoryPayload): Promise<Category> => {
    const { data } = await http.post<ApiResponse<Category>>(
      ENDPOINTS.CATEGORIES.BASE,
      payload,
    );
    return data.Result;
  },

  update: async (id: string, payload: CategoryPayload): Promise<Category> => {
    const { data } = await http.put<ApiResponse<Category>>(
      ENDPOINTS.CATEGORIES.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

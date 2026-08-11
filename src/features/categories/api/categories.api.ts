import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Category,
  CategoryPayload,
} from "@/features/categories/categories.types";
import { USE_MOCK, mock, mockDelay } from "@/api/mock";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    if (USE_MOCK) return mockDelay(mock.categories());
    const { data } = await http.get<ApiResponse<Category[]>>(
      ENDPOINTS.CATEGORIES.GET_ALL,
    );
    return data.Result;
  },

  create: async (payload: CategoryPayload): Promise<Category> => {
    if (USE_MOCK)
      return mockDelay({
        idCategory: `mock-${Date.now()}`,
        categoryName: payload.categoryName,
      });
    const { data } = await http.post<ApiResponse<Category>>(
      ENDPOINTS.CATEGORIES.BASE,
      payload,
    );
    return data.Result;
  },

  update: async (id: string, payload: CategoryPayload): Promise<Category> => {
    if (USE_MOCK)
      return mockDelay({ idCategory: id, categoryName: payload.categoryName });
    const { data } = await http.put<ApiResponse<Category>>(
      ENDPOINTS.CATEGORIES.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.CATEGORIES.BY_ID(id));
  },
};

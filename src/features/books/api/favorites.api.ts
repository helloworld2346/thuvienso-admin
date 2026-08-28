import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { Book } from "@/features/books/books.types";
import { USE_MOCK, mockDelay, mock } from "@/api/mock";

export const favoritesApi = {
  getMy: async (): Promise<Book[]> => {
    if (USE_MOCK) return mockDelay(mock.books());
    const { data } = await http.get<ApiResponse<Book[]>>(
      ENDPOINTS.FAVORITES.MY,
    );
    return data.Result;
  },

  add: async (idBook: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.post(ENDPOINTS.FAVORITES.BY_BOOK(idBook));
  },

  remove: async (idBook: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.FAVORITES.BY_BOOK(idBook));
  },
};

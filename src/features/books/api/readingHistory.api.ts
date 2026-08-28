import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { Book } from "@/features/books/books.types";
import { USE_MOCK, mockDelay, mock } from "@/api/mock";

export const readingHistoryApi = {
  getMy: async (): Promise<Book[]> => {
    if (USE_MOCK) return mockDelay(mock.books());
    const { data } = await http.get<ApiResponse<Book[]>>(
      ENDPOINTS.READING_HISTORY.MY,
    );
    return data.Result;
  },

  record: async (idBook: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.post(ENDPOINTS.READING_HISTORY.BY_BOOK(idBook));
  },
};

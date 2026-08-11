import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { Book, BookPayload } from "@/features/books/books.types";

export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    const { data } = await http.get<ApiResponse<Book[]>>(
      ENDPOINTS.BOOKS.GET_ALL,
    );
    return data.Result;
  },

  create: async (payload: BookPayload): Promise<Book> => {
    const { data } = await http.post<ApiResponse<Book>>(
      ENDPOINTS.BOOKS.BASE,
      payload,
    );
    return data.Result;
  },

  update: async (id: string, payload: BookPayload): Promise<Book> => {
    const { data } = await http.put<ApiResponse<Book>>(
      ENDPOINTS.BOOKS.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(ENDPOINTS.BOOKS.BY_ID(id));
  },
};

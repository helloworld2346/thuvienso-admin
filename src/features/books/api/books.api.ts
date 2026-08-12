import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Book,
  BookPayload,
  BookCreateInput,
  FileResponse,
} from "@/features/books/books.types";
import { USE_MOCK, mockDelay, mock } from "@/api/mock";

export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    if (USE_MOCK) return mockDelay(mock.books());
    const { data } = await http.get<ApiResponse<Book[]>>(
      ENDPOINTS.BOOKS.GET_ALL,
    );
    return data.Result;
  },

  getFilesByDocument: async (idDocument: string): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());
    const { data } = await http.get<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.BY_DOCUMENT(idDocument),
    );
    return data.Result;
  },

  create: async (input: BookCreateInput): Promise<Book> => {
    const { file, ...request } = input;
    if (USE_MOCK)
      return mockDelay({
        idBook: `mock-book-${Date.now()}`,
        availableCopies: request.totalCopies,
        thumbnail: "",
        ...request,
      });

    const form = new FormData();
    form.append(
      "book",
      new Blob([JSON.stringify(request)], { type: "application/json" }),
    );
    form.append("file", file);

    const { data } = await http.post<ApiResponse<Book>>(
      ENDPOINTS.BOOKS.UPLOAD,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.Result;
  },

  update: async (id: string, payload: BookPayload): Promise<Book> => {
    if (USE_MOCK)
      return mockDelay({
        idBook: id,
        availableCopies: payload.totalCopies,
        thumbnail: "",
        ...payload,
      });
    const { data } = await http.put<ApiResponse<Book>>(
      ENDPOINTS.BOOKS.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.BOOKS.BY_ID(id));
  },
};

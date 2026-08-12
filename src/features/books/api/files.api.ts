import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { FileResponse } from "@/features/books/books.types";
import { USE_MOCK, mockDelay, mock } from "@/api/mock";

export const filesApi = {
  getByDocument: async (idDocument: string): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());
    const { data } = await http.get<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.BY_DOCUMENT(idDocument),
    );
    return data.Result;
  },
};

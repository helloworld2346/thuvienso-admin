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

  uploadThumbnail: async (
    idDocument: string,
    file: File,
  ): Promise<FileResponse> => {
    if (USE_MOCK) return mockDelay(mock.files()[0]);
    const form = new FormData();
    form.append("file", file);
    const { data } = await http.post<ApiResponse<FileResponse>>(
      ENDPOINTS.FILES.UPLOAD(idDocument),
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.Result;
  },
};

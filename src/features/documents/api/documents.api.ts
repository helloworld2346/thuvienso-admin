import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Document,
  DocumentPayload,
} from "@/features/documents/documents.types";
import { USE_MOCK, mockDelay, mock } from "@/api/mock";

export const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    if (USE_MOCK) return mockDelay(mock.documents());
    const { data } = await http.get<ApiResponse<Document[]>>(
      ENDPOINTS.DOCUMENTS.GET_ALL,
    );
    return data.Result;
  },

  create: async (payload: DocumentPayload): Promise<Document> => {
    if (USE_MOCK)
      return mockDelay({
        idDocument: `mock-doc-${Date.now()}`,
        thumbnail: "",
        ...payload,
      });
    const { data } = await http.post<ApiResponse<Document>>(
      ENDPOINTS.DOCUMENTS.BASE,
      payload,
    );
    return data.Result;
  },

  update: async (id: string, payload: DocumentPayload): Promise<Document> => {
    if (USE_MOCK)
      return mockDelay({
        idDocument: id,
        thumbnail: "",
        ...payload,
      });
    const { data } = await http.put<ApiResponse<Document>>(
      ENDPOINTS.DOCUMENTS.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.DOCUMENTS.BY_ID(id));
  },
};

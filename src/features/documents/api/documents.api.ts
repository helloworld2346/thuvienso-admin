import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Document,
  DocumentPayload,
} from "@/features/documents/documents.types";
import { USE_MOCK, mockDelay, mock } from "@/api/mock";

function toArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    const inner = o.content ?? o.list ?? o.data ?? o.items;
    if (Array.isArray(inner)) return inner as T[];
  }
  return [];
}

function readList<T>(data: unknown): T[] {
  const d = data as { Result?: unknown; result?: unknown };
  return toArray<T>(d.Result ?? d.result);
}

export const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    if (USE_MOCK) return mockDelay(mock.documents());
    const { data } = await http.get<ApiResponse<Document[]>>(
      ENDPOINTS.DOCUMENTS.GET_ALL,
    );
    return data.Result;
  },

  getByFolder: async (idFolder: string): Promise<Document[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<unknown>>(
      ENDPOINTS.DOCUMENTS.BY_FOLDER(idFolder),
    );
    return readList<Document>(data);
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

import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Collection,
  CollectionPayload,
} from "@/features/collections/collections.types";
import type { Document } from "@/features/documents/documents.types";
import { USE_MOCK, mockDelay } from "@/api/mock";

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

export const collectionsApi = {
  getAll: async (): Promise<Collection[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<unknown>(ENDPOINTS.COLLECTIONS.GET_ALL);
    return readList<Collection>(data);
  },

  create: async (payload: CollectionPayload): Promise<Collection> => {
    if (USE_MOCK)
      return mockDelay({ idCollection: `mock-${Date.now()}`, ...payload });
    const { data } = await http.post<ApiResponse<Collection>>(
      ENDPOINTS.COLLECTIONS.BASE,
      payload,
    );
    return data.Result;
  },

  update: async (
    id: string,
    payload: CollectionPayload,
  ): Promise<Collection> => {
    if (USE_MOCK) return mockDelay({ idCollection: id, ...payload });
    const { data } = await http.put<ApiResponse<Collection>>(
      ENDPOINTS.COLLECTIONS.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.COLLECTIONS.BY_ID(id));
  },

  getDocuments: async (id: string): Promise<Document[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<unknown>(
      ENDPOINTS.COLLECTIONS.DOCUMENTS(id),
    );
    return readList<Document>(data);
  },

  addDocument: async (id: string, idDocument: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.post(ENDPOINTS.COLLECTIONS.ADD_DOCUMENT(id, idDocument));
  },

  removeDocument: async (id: string, idDocument: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.COLLECTIONS.REMOVE_DOCUMENT(id, idDocument));
  },
};

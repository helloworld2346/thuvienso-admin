import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Folder,
  FolderDetail,
  FolderCreatePayload,
  FolderUpdatePayload,
} from "@/features/folders/folders.types";
import { USE_MOCK, mockDelay } from "@/api/mock";

function readList<T>(data: unknown): T[] {
  const d = data as { Result?: unknown; result?: unknown };
  const payload = d.Result ?? d.result;
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    const inner = o.content ?? o.list ?? o.data ?? o.items;
    if (Array.isArray(inner)) return inner as T[];
  }
  return [];
}

export const foldersApi = {
  getChildren: async (id: string): Promise<Folder[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<unknown>>(
      ENDPOINTS.FOLDERS.CHILDREN(id),
    );
    return readList<Folder>(data);
  },

  getDeleted: async (): Promise<Folder[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<unknown>>(
      ENDPOINTS.FOLDERS.DELETED,
    );
    return readList<Folder>(data);
  },

  getRoots: async (): Promise<Folder[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<Folder>>(
      ENDPOINTS.FOLDERS.LEVEL1,
    );
    const root = (data.Result ?? (data as { result?: Folder }).result) as
      | Folder
      | undefined;
    return root ? [root] : [];
  },

  create: async (payload: FolderCreatePayload): Promise<FolderDetail> => {
    if (USE_MOCK)
      return mockDelay({
        idFolder: `mock-${Date.now()}`,
        folderName: payload.folderName,
        description: payload.description,
      });
    const { data } = await http.post<ApiResponse<FolderDetail>>(
      ENDPOINTS.FOLDERS.BASE,
      payload,
    );
    return data.Result;
  },

  update: async (
    id: string,
    payload: FolderUpdatePayload,
  ): Promise<FolderDetail> => {
    if (USE_MOCK)
      return mockDelay({ idFolder: id, folderName: payload.folderName });
    const { data } = await http.put<ApiResponse<FolderDetail>>(
      ENDPOINTS.FOLDERS.BY_ID(id),
      payload,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.FOLDERS.BY_ID(id));
  },

  restore: async (id: string): Promise<FolderDetail> => {
    if (USE_MOCK) return mockDelay({ idFolder: id, folderName: "restored" });
    const { data } = await http.put<ApiResponse<FolderDetail>>(
      ENDPOINTS.FOLDERS.RESTORE(id),
    );
    return data.Result;
  },

  move: async (id: string, parentFolder: string): Promise<FolderDetail> => {
    if (USE_MOCK) return mockDelay({ idFolder: id, folderName: "moved" });
    const { data } = await http.put<ApiResponse<FolderDetail>>(
      ENDPOINTS.FOLDERS.MOVE(id),
      { parentFolder },
    );
    return data.Result;
  },
};

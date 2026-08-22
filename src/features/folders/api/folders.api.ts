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

export const foldersApi = {
  getChildren: async (id: string): Promise<Folder[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<Folder[]>>(
      ENDPOINTS.FOLDERS.CHILDREN(id),
    );
    return data.Result;
  },

  getDeleted: async (): Promise<Folder[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<Folder[]>>(
      ENDPOINTS.FOLDERS.DELETED,
    );
    return data.Result;
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
  
  getRoots: async (): Promise<Folder[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<Folder[]>>(
      ENDPOINTS.FOLDERS.LEVEL1,
    );
    return data.Result;
  },
};

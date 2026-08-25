import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  FileResponse,
  CopyFileRequest,
  CutFileRequest,
} from "@/features/files/files.types";
import { USE_MOCK, mockDelay, mock } from "@/api/mock";

export const filesApi = {
  getByDocument: async (idDocument: string): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());
    const { data } = await http.get<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.BY_DOCUMENT(idDocument),
    );
    return data.Result;
  },

  uploadToFolder: async (
    idFolder: string,
    files: File[],
  ): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());

    const form = new FormData();
    files.forEach((f) => form.append("file", f));

    const { data } = await http.post<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.UPLOAD_TO_FOLDER(idFolder),
      form,
      { headers: { "Content-Type": undefined } },
    );
    return data.Result;
  },

  getByFolder: async (idFolder: string): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());
    const { data } = await http.get<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.BY_FOLDER(idFolder),
    );
    return data.Result;
  },

  copyToFolder: async (
    idFolderParent: string,
    fileIds: string[],
  ): Promise<FileResponse[]> => {
    const { data } = await http.post<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.COPY(idFolderParent),
      { files: fileIds } satisfies CopyFileRequest,
    );
    return data.Result;
  },

  moveToFolder: async (
    idFolderParent: string,
    fileIds: string[],
  ): Promise<FileResponse[]> => {
    const { data } = await http.post<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.CUT(idFolderParent),
      { files: fileIds } satisfies CutFileRequest,
    );
    return data.Result;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(ENDPOINTS.FILES.DELETE(id));
  },
};

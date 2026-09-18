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

  download: async (id: string, fileName?: string): Promise<void> => {
    const res = await http.get(ENDPOINTS.FILES.DOWNLOAD(id), {
      responseType: "blob",
    });

    let name = fileName;
    const cd = res.headers["content-disposition"] as string | undefined;
    if (cd) {
      const star = /filename\*=UTF-8''([^;]+)/i.exec(cd);
      const plain = /filename="?([^";]+)"?/i.exec(cd);
      if (star?.[1]) name = decodeURIComponent(star[1]);
      else if (plain?.[1]) name = plain[1];
    }

    const objectUrl = URL.createObjectURL(res.data as Blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = name || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(ENDPOINTS.FILES.DELETE(id));
  },

  hardRemove: async (id: string): Promise<void> => {
    await http.delete(ENDPOINTS.FILES.HARD_DELETE(id));
  },

  getDeleted: async (): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());
    const { data } = await http.get<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.DELETED,
    );
    return data.Result;
  },

  restore: async (id: string): Promise<FileResponse> => {
    const { data } = await http.put<ApiResponse<FileResponse>>(
      ENDPOINTS.FILES.RESTORE(id),
    );
    return data.Result;
  },

  getByCategory: async (idCategory: string): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());
    const { data } = await http.get<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.BY_CATEGORY(idCategory),
    );
    return data.Result;
  },

  uploadToCategory: async (
    idCategory: string,
    files: File[],
  ): Promise<FileResponse[]> => {
    if (USE_MOCK) return mockDelay(mock.files());

    const form = new FormData();
    files.forEach((f) => form.append("file", f));

    const { data } = await http.post<ApiResponse<FileResponse[]>>(
      ENDPOINTS.FILES.UPLOAD_TO_CATEGORY(idCategory),
      form,
      { headers: { "Content-Type": undefined } },
    );
    return data.Result;
  },
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "@/features/files/api/files.api";
import { toast } from "@/store/toast.store";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function useFilesByDocument(idDocument: string | undefined) {
  return useQuery({
    queryKey: ["files", idDocument],
    queryFn: () => filesApi.getByDocument(idDocument as string),
    enabled: !!idDocument,
  });
}

export function useUploadFilesToFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idFolder, files }: { idFolder: string; files: File[] }) =>
      filesApi.uploadToFolder(idFolder, files),
    onSuccess: (_data, { idFolder }) => {
      qc.invalidateQueries({ queryKey: ["files", "folder", idFolder] });
      qc.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Tải file lên thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Tải file lên thất bại")),
  });
}

export function useFilesByFolder(idFolder: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["files", "folder", idFolder],
    queryFn: () => filesApi.getByFolder(idFolder as string),
    enabled: enabled && !!idFolder,
  });
}

export function useCopyFilesToFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      idFolder,
      fileIds,
    }: {
      idFolder: string;
      fileIds: string[];
    }) => filesApi.copyToFolder(idFolder, fileIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["files"] });
      qc.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Sao chép file thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Sao chép file thất bại")),
  });
}

export function useMoveFilesToFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      idFolder,
      fileIds,
    }: {
      idFolder: string;
      fileIds: string[];
    }) => filesApi.moveToFolder(idFolder, fileIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["files"] });
      qc.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Di chuyển file thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Di chuyển file thất bại")),
  });
}

export function useDeleteFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => filesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["files"] });
      qc.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Xoá file thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Xoá file thất bại")),
  });
}

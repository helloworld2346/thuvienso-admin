import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "@/features/books/api/files.api";
import { toast } from "@/store/toast.store";

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
      qc.invalidateQueries({ queryKey: ["documents", "folder", idFolder] });
      qc.invalidateQueries({ queryKey: ["files", "folder", idFolder] });
      qc.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Tải file lên thành công");
    },
    onError: () => toast.error("Tải file lên thất bại"),
  });
}

export function useFilesByFolder(idFolder: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["files", "folder", idFolder],
    queryFn: () => filesApi.getByFolder(idFolder as string),
    enabled: enabled && !!idFolder,
  });
}
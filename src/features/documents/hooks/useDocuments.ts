import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsApi } from "@/features/documents/api/documents.api";
import type { DocumentPayload } from "@/features/documents/documents.types";
import { toast } from "@/store/toast.store";

const KEY = ["documents"] as const;

export function useDocuments() {
  return useQuery({
    queryKey: KEY,
    queryFn: documentsApi.getAll,
  });
}

export function useCreateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DocumentPayload) => documentsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Thêm tài liệu thành công");
    },
    onError: () => toast.error("Thêm tài liệu thất bại"),
  });
}

export function useUpdateDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DocumentPayload }) =>
      documentsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Cập nhật tài liệu thành công");
    },
    onError: () => toast.error("Cập nhật tài liệu thất bại"),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Xoá tài liệu thành công");
    },
    onError: () => toast.error("Xoá tài liệu thất bại"),
  });
}

export function useDocumentsByFolder(idFolder: string, enabled = true) {
  return useQuery({
    queryKey: [...KEY, "folder", idFolder] as const,
    queryFn: () => documentsApi.getByFolder(idFolder),
    enabled: enabled && !!idFolder,
  });
}

export function useMoveDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, folderEntity }: { id: string; folderEntity: string }) =>
      documentsApi.move(id, folderEntity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Di chuyển tài liệu thành công");
    },
    onError: () => toast.error("Di chuyển tài liệu thất bại"),
  });
}
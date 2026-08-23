import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { foldersApi } from "@/features/folders/api/folders.api";
import type {
  FolderCreatePayload,
  FolderUpdatePayload,
} from "@/features/folders/folders.types";
import { toast } from "@/store/toast.store";
import { getErrorMessage } from "@/utils/getErrorMessage";

const KEY = ["folders"] as const;
const childrenKey = (id: string) => [...KEY, "children", id] as const;
const deletedKey = [...KEY, "deleted"] as const;

export function useFolderChildren(id: string, enabled = true) {
  return useQuery({
    queryKey: childrenKey(id),
    queryFn: () => foldersApi.getChildren(id),
    enabled: enabled && !!id,
  });
}

export function useDeletedFolders(enabled = true) {
  return useQuery({
    queryKey: deletedKey,
    queryFn: foldersApi.getDeleted,
    enabled,
  });
}

export function useHardDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => foldersApi.hardRemove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Xoá vĩnh viễn thư mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Xoá vĩnh viễn thư mục thất bại")),
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FolderCreatePayload) => foldersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Thêm thư mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Thêm thư mục thất bại")),
  });
}

export function useUpdateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: FolderUpdatePayload;
    }) => foldersApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Cập nhật thư mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Cập nhật thư mục thất bại")),
  });
}

export function useDeleteFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => foldersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Xoá thư mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Xoá thư mục thất bại")),
  });
}

export function useRestoreFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => foldersApi.restore(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Khôi phục thư mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Khôi phục thư mục thất bại")),
  });
}

export function useRootFolders() {
  return useQuery({
    queryKey: [...KEY, "roots"],
    queryFn: foldersApi.getRoots,
  });
}

export function useMoveFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parentFolder }: { id: string; parentFolder: string }) =>
      foldersApi.move(id, parentFolder),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Di chuyển thư mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Di chuyển thư mục thất bại")),
  });
}

export function useCopyFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parentFolder }: { id: string; parentFolder: string }) =>
      foldersApi.copy(id, parentFolder),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Sao chép thư mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Sao chép thư mục thất bại")),
  });
}

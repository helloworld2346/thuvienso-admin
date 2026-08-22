import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionsApi } from "@/features/collections/api/collections.api";
import type { CollectionPayload } from "@/features/collections/collections.types";
import { toast } from "@/store/toast.store";

const KEY = ["collections"] as const;

export function useCollections() {
  return useQuery({ queryKey: KEY, queryFn: collectionsApi.getAll });
}

export function useCollectionDocuments(id: string, enabled = true) {
  return useQuery({
    queryKey: [...KEY, "documents", id],
    queryFn: () => collectionsApi.getDocuments(id),
    enabled: enabled && !!id,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CollectionPayload) => collectionsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Thêm bộ sưu tập thành công");
    },
    onError: () => toast.error("Thêm bộ sưu tập thất bại"),
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CollectionPayload }) =>
      collectionsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Cập nhật bộ sưu tập thành công");
    },
    onError: () => toast.error("Cập nhật bộ sưu tập thất bại"),
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collectionsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Xoá bộ sưu tập thành công");
    },
    onError: () => toast.error("Xoá bộ sưu tập thất bại"),
  });
}

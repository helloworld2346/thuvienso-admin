import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/features/categories/api/categories.api";
import type {
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from "@/features/categories/categories.types";
import { toast } from "@/store/toast.store";
import { getErrorMessage } from "@/utils/getErrorMessage";

const KEY = ["categories"] as const;

export function useCategories() {
  return useQuery({ queryKey: KEY, queryFn: categoriesApi.getAll });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: [...KEY, "tree"],
    queryFn: categoriesApi.tree,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryCreatePayload) =>
      categoriesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Thêm danh mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Thêm danh mục thất bại")),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CategoryUpdatePayload;
    }) => categoriesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Cập nhật danh mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Cập nhật danh mục thất bại")),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Xoá danh mục thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Xoá danh mục thất bại")),
  });
}

export function useCategoryChildren(id: string | null) {
  return useQuery({
    queryKey: [...KEY, "children", id],
    queryFn: () => categoriesApi.children(id as string),
    enabled: !!id,
  });
}
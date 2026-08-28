import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { newsApi } from "@/features/news/api/news.api";
import type { NewsPayload } from "@/features/news/news.types";
import { toast } from "@/store/toast.store";
import { getErrorMessage } from "@/utils/getErrorMessage";

const KEY = ["news"] as const;

export function useNews(
  page: number,
  size: number,
  keyword?: string,
  status?: string,
) {
  return useQuery({
    queryKey: [...KEY, page, size, keyword ?? "", status ?? ""],
    queryFn: () => newsApi.adminList(page, size, keyword, status),
    placeholderData: keepPreviousData,
  });
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewsPayload) => newsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Thêm tin tức thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Thêm tin tức thất bại")),
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NewsPayload }) =>
      newsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Cập nhật tin tức thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Cập nhật tin tức thất bại")),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Xoá tin tức thành công");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Xoá tin tức thất bại")),
  });
}

export function useUploadNewsImage() {
  return useMutation({
    mutationFn: (file: File) => newsApi.uploadImage(file),
    onError: (error) =>
      toast.error(getErrorMessage(error, "Tải ảnh lên thất bại")),
  });
}
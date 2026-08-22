import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { booksApi } from "@/features/books/api/books.api";
import type {
  BookPayload,
  BookCreateInput,
} from "@/features/books/books.types";
import { toast } from "@/store/toast.store";

const KEY = ["books"] as const;

export function useBooks() {
  return useQuery({
    queryKey: KEY,
    queryFn: booksApi.getAll,
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BookCreateInput) => booksApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Thêm sách thành công");
    },
    onError: () => toast.error("Thêm sách thất bại"),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookPayload }) =>
      booksApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Cập nhật sách thành công");
    },
    onError: () => toast.error("Cập nhật sách thất bại"),
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => booksApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Xoá sách thành công");
    },
    onError: () => toast.error("Xoá sách thất bại"),
  });
}

export function useUploadBookAudio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, audio }: { id: string; audio: File }) =>
      booksApi.uploadAudio(id, audio),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["files"] });
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Tải audio thành công");
    },
    onError: () => toast.error("Tải audio thất bại"),
  });
}
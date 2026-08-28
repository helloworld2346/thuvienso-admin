import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "@/features/books/api/favorites.api";
import { toast } from "@/store/toast.store";
import { getErrorMessage } from "@/utils/getErrorMessage";

const KEY = ["favorites"] as const;

export function useMyFavorites() {
  return useQuery({
    queryKey: KEY,
    queryFn: favoritesApi.getMy,
  });
}

export function useAddFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idBook: string) => favoritesApi.add(idBook),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Đã thêm vào yêu thích");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Thêm yêu thích thất bại")),
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idBook: string) => favoritesApi.remove(idBook),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Đã bỏ yêu thích");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Bỏ yêu thích thất bại")),
  });
}

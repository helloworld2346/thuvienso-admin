import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readingHistoryApi } from "@/features/books/api/readingHistory.api";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { toast } from "@/store/toast.store";

const KEY = ["reading-history"] as const;

export function useMyReadingHistory() {
  return useQuery({
    queryKey: KEY,
    queryFn: readingHistoryApi.getMy,
  });
}

export function useRecordReading() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idBook: string) => readingHistoryApi.record(idBook),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Ghi lịch sử đọc thất bại")),
  });
}

import { useQuery } from "@tanstack/react-query";
import { filesApi } from "@/features/books/api/files.api";

export function useFilesByDocument(idDocument: string | undefined) {
  return useQuery({
    queryKey: ["files", idDocument],
    queryFn: () => filesApi.getByDocument(idDocument as string),
    enabled: !!idDocument,
  });
}

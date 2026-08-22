import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "@/features/audit-logs/api/audit-logs.api";

const KEY = ["audit-logs"] as const;

export function useAuditLogs(page: number, size: number) {
  return useQuery({
    queryKey: [...KEY, page, size],
    queryFn: () => auditLogsApi.getAll(page, size),
    placeholderData: keepPreviousData,
  });
}

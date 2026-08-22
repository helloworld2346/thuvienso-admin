import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "@/features/audit-logs/api/audit-logs.api";

const KEY = ["audit-logs"] as const;

export function useAuditLogs(page: number, size: number, userName?: string) {
  const trimmed = userName?.trim() ?? "";
  return useQuery({
    queryKey: [...KEY, page, size, trimmed],
    queryFn: () =>
      trimmed
        ? auditLogsApi.getByUser(trimmed, page, size)
        : auditLogsApi.getAll(page, size),
    placeholderData: keepPreviousData,
  });
}

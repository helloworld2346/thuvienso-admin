import { useState } from "react";
import { FiFileText } from "react-icons/fi";
import { useAuditLogs } from "@/features/audit-logs/hooks/useAuditLogs";
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_STYLES,
} from "@/features/audit-logs/audit-logs.types";
import { PageHeader } from "@/components/ui/PageHeader";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { StateView } from "@/components/ui/StateView";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, isLoading, isError } = useAuditLogs(page - 1, pageSize);

  const rows = data?.content ?? [];
  const total = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <div className="mb-5">
        <PageHeader
          title="Nhật ký hoạt động"
          subtitle={`${total} bản ghi`}
          icon={<FiFileText size={22} />}
        />
      </div>

      <StateView
        isLoading={isLoading}
        isError={isError}
        isEmpty={total === 0}
        errorText="Không tải được nhật ký hoạt động."
        emptyText="Chưa có nhật ký nào."
        emptyIcon={<FiFileText size={30} />}
      >
        <div className="overflow-x-auto rounded-xl border border-app-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-3 text-left text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Thời gian</th>
                <th className="px-4 py-3 font-medium">Người dùng</th>
                <th className="px-4 py-3 font-medium">Hành động</th>
                <th className="px-4 py-3 font-medium">Đối tượng</th>
                <th className="px-4 py-3 font-medium">Phương thức</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((log) => (
                <tr
                  key={log.idAuditLog}
                  className="border-t border-app-border hover:bg-surface-3/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {log.userName || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        AUDIT_ACTION_STYLES[log.action] ??
                        AUDIT_ACTION_STYLES.OTHER
                      }`}
                    >
                      {AUDIT_ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {log.targetType || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {log.httpMethod || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {log.ipAddress || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        log.success
                          ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                      }`}
                    >
                      {log.success ? "Thành công" : "Thất bại"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <PaginationBar
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>
      </StateView>
    </div>
  );
}

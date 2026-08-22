import { Fragment, useEffect, useMemo, useState } from "react";
import { FiFileText, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useAuditLogs } from "@/features/audit-logs/hooks/useAuditLogs";
import {
  AUDIT_ACTIONS,
  AUDIT_ACTION_LABELS,
  AUDIT_ACTION_STYLES,
} from "@/features/audit-logs/audit-logs.types";
import { PageHeader } from "@/components/ui/PageHeader";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { StateView } from "@/components/ui/StateView";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

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

const ACTION_OPTIONS = [
  { value: "", label: "Tất cả hành động" },
  ...AUDIT_ACTIONS.map((a) => ({ value: a, label: AUDIT_ACTION_LABELS[a] })),
];

const COL_COUNT = 8;

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // A — lọc theo userName (server-side, có debounce)
  const [userInput, setUserInput] = useState("");
  const [userQuery, setUserQuery] = useState("");
  // A — lọc theo action (client-side trên trang hiện tại)
  const [actionFilter, setActionFilter] = useState("");
  // B — mở rộng dòng để xem uri/detail
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setUserQuery(userInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [userInput]);

  const { data, isLoading, isError } = useAuditLogs(
    page - 1,
    pageSize,
    userQuery,
  );

  const total = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const filteredRows = useMemo(() => {
    const rows = data?.content ?? [];
    return actionFilter ? rows.filter((r) => r.action === actionFilter) : rows;
  }, [data?.content, actionFilter]);

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <div className="mb-5">
        <PageHeader
          title="Nhật ký hoạt động"
          subtitle={`${total} bản ghi`}
          icon={<FiFileText size={22} />}
        />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={userInput}
          onChange={setUserInput}
          placeholder="Tìm theo tên người dùng..."
        />
        <div className="w-full sm:w-56">
          <Select
            value={actionFilter}
            options={ACTION_OPTIONS}
            onChange={setActionFilter}
            placeholder="Tất cả hành động"
            aria-label="Lọc theo hành động"
          />
        </div>
        {actionFilter && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            * Lọc hành động chỉ áp dụng trong trang hiện tại
          </p>
        )}
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
                <th className="w-8 px-4 py-3" />
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
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={COL_COUNT}
                    className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Không có bản ghi phù hợp bộ lọc.
                  </td>
                </tr>
              )}
              {filteredRows.map((log) => {
                const isOpen = expanded === log.idAuditLog;
                return (
                  <Fragment key={log.idAuditLog}>
                    <tr className="border-t border-app-border hover:bg-surface-3/50">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(isOpen ? null : log.idAuditLog)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-surface-3 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          aria-label={isOpen ? "Thu gọn" : "Xem chi tiết"}
                          aria-expanded={isOpen}
                        >
                          {isOpen ? (
                            <FiChevronDown size={16} />
                          ) : (
                            <FiChevronRight size={16} />
                          )}
                        </button>
                      </td>
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
                    {isOpen && (
                      <tr className="border-t border-app-border bg-surface-3/40">
                        <td />
                        <td colSpan={COL_COUNT - 1} className="px-4 py-3">
                          <dl className="grid gap-2 sm:grid-cols-[80px_1fr]">
                            <dt className="text-xs font-medium text-gray-400 dark:text-gray-500">
                              URI
                            </dt>
                            <dd className="break-all font-mono text-xs text-gray-600 dark:text-gray-300">
                              {log.uri || "—"}
                            </dd>
                            <dt className="text-xs font-medium text-gray-400 dark:text-gray-500">
                              Chi tiết
                            </dt>
                            <dd className="whitespace-pre-wrap break-words text-xs text-gray-600 dark:text-gray-300">
                              {log.detail || "—"}
                            </dd>
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
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

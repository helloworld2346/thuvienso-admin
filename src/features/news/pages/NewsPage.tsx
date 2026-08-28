// src/features/news/pages/NewsPage.tsx
import { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiEye } from "react-icons/fi";
import { useNews, useDeleteNews } from "@/features/news/hooks/useNews";
import type { News } from "@/features/news/news.types";
import {
  DOCUMENT_STATUSES,
  DOCUMENT_STATUS_LABELS,
} from "@/features/documents/documents.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StateView } from "@/components/ui/StateView";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  ...DOCUMENT_STATUSES.map((s) => ({
    value: s,
    label: DOCUMENT_STATUS_LABELS[s],
  })),
];

const STATUS_STYLES: Record<string, string> = {
  Pending:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  Approve:
    "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Refuse: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading, isError } = useNews(page - 1, pageSize);
  const deleteMut = useDeleteNews();

  const [deleting, setDeleting] = useState<News | null>(null);

  const total = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const navigate = useNavigate();

  const rows = useMemo(() => {
    const list = data?.content ?? [];
    return statusFilter ? list.filter((n) => n.status === statusFilter) : list;
  }, [data?.content, statusFilter]);

  const openCreate = () => navigate("/dashboard/news/create");
  const openEdit = (n: News) => navigate(`/dashboard/news/${n.idNews}/edit`);
  const openView = (n: News) => navigate(`/dashboard/news/${n.idNews}`);

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idNews, { onSuccess: () => setDeleting(null) });
  };

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <PageHeader
        title="Tin tức"
        subtitle={`${total} tin`}
        icon={<FiFileText size={22} />}
        action={
          <>
            <div className="w-full sm:w-56">
              <Select
                value={statusFilter}
                options={STATUS_OPTIONS}
                onChange={setStatusFilter}
                placeholder="Tất cả trạng thái"
                aria-label="Lọc theo trạng thái"
              />
            </div>
            <Button leftIcon={<FiPlus size={16} />} onClick={openCreate}>
              Thêm
            </Button>
          </>
        }
      />

      <StateView
        isLoading={isLoading}
        isError={isError}
        isEmpty={total === 0}
        errorText="Không tải được danh sách tin tức."
        emptyText="Chưa có tin tức nào."
        emptyIcon={<FiFileText size={30} />}
      >
        <div className="overflow-x-auto rounded-xl border border-app-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-3 text-left text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Tiêu đề</th>
                <th className="px-4 py-3 font-medium">Danh mục</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Lượt xem</th>
                <th className="px-4 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Không có tin phù hợp bộ lọc.
                  </td>
                </tr>
              )}
              {rows.map((n) => (
                <tr
                  key={n.idNews}
                  className="border-t border-app-border hover:bg-surface-3/50"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openView(n)}
                      className="text-left font-medium text-gray-800 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                    >
                      {n.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {n.categoryEntity?.categoryName ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[n.status] ?? STATUS_STYLES.Pending
                      }`}
                    >
                      {DOCUMENT_STATUS_LABELS[n.status] ?? n.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    <span className="inline-flex items-center gap-1">
                      <FiEye size={14} /> {n.viewCount ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openView(n)}
                        className="rounded-md p-2 text-gray-500 hover:bg-surface-3 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-primary"
                        aria-label="Xem"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(n)}
                        className="rounded-md p-2 text-gray-500 hover:bg-surface-3 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        aria-label="Sửa"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(n)}
                        className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        aria-label="Xoá"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
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

      <ConfirmDialog
        open={!!deleting}
        title="Xoá tin tức"
        message={`Bạn có chắc muốn xoá tin "${deleting?.title}"? Hành động này không thể hoàn tác.`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

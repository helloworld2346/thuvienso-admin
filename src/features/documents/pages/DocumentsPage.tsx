import { useMemo, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFileText,
} from "react-icons/fi";
import {
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "@/features/documents/hooks/useDocuments";
import { DocumentFormModal } from "@/features/documents/components/DocumentFormModal";
import type {
  Document,
  DocumentPayload,
} from "@/features/documents/documents.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginationBar } from "@/components/ui/PaginationBar";

export default function DocumentsPage() {
  const { data, isLoading, isError } = useDocuments();
  const createMut = useCreateDocument();
  const updateMut = useUpdateDocument();
  const deleteMut = useDeleteDocument();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState<Document | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q),
    );
  }, [data, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (d: Document) => {
    setEditing(d);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = (values: DocumentPayload) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.idDocument, payload: values },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(values, { onSuccess: close });
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idDocument, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 shadow-sm">
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
              <FiFileText size={26} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white">Tài liệu</h1>
              <p className="mt-0.5 text-sm text-white/70">{total} tài liệu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]"
          >
            <FiPlus size={16} /> Thêm tài liệu
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm theo tiêu đề, nội dung..."
              aria-label="Tìm tài liệu"
              className="h-10 w-full rounded-full border border-app-border bg-surface pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-100 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {isLoading && (
          <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            Đang tải...
          </p>
        )}
        {isError && (
          <p className="py-16 text-center text-sm text-red-600 dark:text-red-400">
            Không tải được danh sách tài liệu.
          </p>
        )}
        {!isLoading && !isError && total === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
              <FiFileText size={30} />
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {search
                ? "Không tìm thấy tài liệu phù hợp."
                : "Chưa có tài liệu."}
            </p>
          </div>
        )}

        {!isLoading && !isError && total > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paged.map((d) => (
                <div
                  key={d.idDocument}
                  className="group flex flex-col rounded-xl border border-app-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    {d.thumbnail ? (
                      <img
                        src={d.thumbnail}
                        alt={d.title}
                        loading="lazy"
                        className="h-14 w-11 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                        <FiFileText size={18} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {d.title}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {d.typeDocument}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => openEdit(d)}
                        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-primary/10 hover:text-primary dark:text-gray-400"
                        aria-label="Sửa"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(d)}
                        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        aria-label="Xoá"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate">{d.content}</span>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary dark:bg-primary/20">
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <PaginationBar
                page={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </>
        )}
      </div>

      <DocumentFormModal
        open={open}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá tài liệu"
        message={`Bạn có chắc muốn xoá tài liệu "${deleting?.title}"? Hành động này không thể hoàn tác.`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
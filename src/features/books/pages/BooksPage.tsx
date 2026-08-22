import { useMemo, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBook,
  FiEye,
} from "react-icons/fi";
import {
  useBooks,
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
} from "@/features/books/hooks/useBooks";
import { BookFormModal } from "@/features/books/components/BookFormModal";
import { BookFilesModal } from "@/features/books/components/BookFilesModal";
import type { Book, BookPayload } from "@/features/books/books.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginationBar } from "@/components/ui/PaginationBar";

export default function BooksPage() {
  const { data, isLoading, isError } = useBooks();
  const createMut = useCreateBook();
  const updateMut = useUpdateBook();
  const deleteMut = useDeleteBook();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [viewing, setViewing] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.bookCode.toLowerCase().includes(q),
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

  const openEdit = (b: Book) => {
    setEditing(b);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = (
    values: BookPayload,
    file: File | null,
    cover: File | null,
  ) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.idBook, payload: values },
        { onSuccess: close },
      );
    } else {
      if (!file) return;
      createMut.mutate({ ...values, file, cover }, { onSuccess: close });
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idBook, {
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
              <FiBook size={26} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white">Sách</h1>
              <p className="mt-0.5 text-sm text-white/70">{total} đầu sách</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]"
          >
            <FiPlus size={16} /> Thêm sách
          </button>
        </div>
      </div>

      {/* Toolbar + content */}
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
              placeholder="Tìm theo tên, tác giả, mã..."
              aria-label="Tìm sách"
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
            Không tải được danh sách sách.
          </p>
        )}
        {!isLoading && !isError && total === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
              <FiBook size={30} />
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {search ? "Không tìm thấy sách phù hợp." : "Chưa có sách."}
            </p>
          </div>
        )}

        {!isLoading && !isError && total > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {paged.map((b) => (
                <div
                  key={b.idBook}
                  className="group flex flex-col overflow-hidden rounded-xl border border-app-border bg-surface transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-3">
                    {b.thumbnail ? (
                      <img
                        src={b.thumbnail}
                        alt={b.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-primary/10 text-primary dark:bg-primary/20">
                        <FiBook size={40} />
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setViewing(b)}
                        className="rounded-md bg-white/90 p-1.5 text-gray-700 hover:bg-white hover:text-primary"
                        aria-label="Xem file"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(b)}
                        className="rounded-md bg-white/90 p-1.5 text-gray-700 hover:bg-white hover:text-gray-900"
                        aria-label="Sửa"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(b)}
                        className="rounded-md bg-white/90 p-1.5 text-gray-700 hover:bg-white hover:text-red-600"
                        aria-label="Xoá"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {b.title}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {b.author}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs">
                      <span className="truncate text-gray-500 dark:text-gray-400">
                        Mã: {b.bookCode}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 font-medium ${
                          b.availableCopies > 0
                            ? "bg-primary/10 text-primary dark:bg-primary/20"
                            : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                        }`}
                      >
                        Còn {b.availableCopies}/{b.totalCopies}
                      </span>
                    </div>
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

      <BookFormModal
        open={open}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <BookFilesModal book={viewing} onClose={() => setViewing(null)} />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá sách"
        message={`Bạn có chắc muốn xoá sách "${deleting?.title}"? Hành động này không thể hoàn tác.`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
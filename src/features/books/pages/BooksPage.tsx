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
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6  ">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Sách
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {total} đầu sách
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm theo tên, tác giả, mã..."
              aria-label="Tìm sách"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 sm:w-72"
            />
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <FiPlus size={16} /> Thêm
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Đang tải...
        </p>
      )}
      {isError && (
        <p className="py-12 text-center text-sm text-red-600 dark:text-red-400">
          Không tải được danh sách sách.
        </p>
      )}
      {!isLoading && !isError && total === 0 && (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {search ? "Không tìm thấy sách phù hợp." : "Chưa có sách."}
        </p>
      )}

      {!isLoading && !isError && total > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {paged.map((b) => (
              <div
                key={b.idBook}
                className="group flex flex-col overflow-hidden rounded-xl border border-app-border transition-all hover:border-primary/40 hover:shadow-md  dark:hover:border-primary/40"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate">Mã: {b.bookCode}</span>
                    <span className="shrink-0">
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
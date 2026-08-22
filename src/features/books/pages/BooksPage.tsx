import { useMemo, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiBook,
  FiEye,
  FiMapPin,
  FiCalendar,
  FiLayers,
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
  const [pageSize, setPageSize] = useState(15);

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

  const stats = useMemo(() => {
    const list = data ?? [];
    const totalCopies = list.reduce((acc, b) => acc + b.totalCopies, 0);
    const availableCopies = list.reduce((acc, b) => acc + b.availableCopies, 0);
    return {
      titles: list.length,
      totalCopies,
      availableCopies,
      borrowed: totalCopies - availableCopies,
    };
  }, [data]);

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
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 shadow-lg dark:bg-gradient-to-br dark:from-primary-800 dark:to-primary-900 sm:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute right-10 top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
              <FiBook size={26} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Thư viện · Sách
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white">
                Quản lý đầu sách
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Theo dõi kho sách, số lượng bản và vị trí lưu trữ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Đầu sách", value: stats.titles },
              { label: "Đang mượn", value: stats.borrowed },
              { label: "Sẵn có", value: stats.availableCopies },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/15 backdrop-blur-sm"
              >
                <p className="text-xl font-bold tabular-nums text-white">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-white/60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rounded-3xl border border-app-border bg-surface-2 p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Hiển thị{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {total}
            </span>{" "}
            đầu sách
          </p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Tìm theo tên, tác giả, mã..."
                aria-label="Tìm sách"
                className="w-full rounded-full border border-gray-300 bg-surface py-2.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500 sm:w-72"
              />
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
            >
              <FiPlus size={16} /> Thêm sách
            </button>
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
              {search ? "Không tìm thấy sách phù hợp." : "Chưa có sách nào."}
            </p>
          </div>
        )}

        {!isLoading && !isError && total > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {paged.map((b) => {
                const available = b.availableCopies > 0;
                return (
                  <div
                    key={b.idBook}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-app-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-surface-3">
                      {b.thumbnail ? (
                        <img
                          src={b.thumbnail}
                          alt={b.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 text-primary dark:from-primary/25 dark:to-primary/10">
                          <FiBook size={44} />
                        </span>
                      )}

                      <span
                        className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm ${
                          available
                            ? "bg-emerald-500/90 text-white"
                            : "bg-red-500/90 text-white"
                        }`}
                      >
                        {available ? `Còn ${b.availableCopies}` : "Hết sách"}
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => setViewing(b)}
                          className="translate-y-2 rounded-full bg-white/95 p-2 text-gray-700 shadow-md transition-all duration-200 hover:bg-white hover:text-primary group-hover:translate-y-0"
                          aria-label="Xem file"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(b)}
                          className="translate-y-2 rounded-full bg-white/95 p-2 text-gray-700 shadow-md transition-all delay-[30ms] duration-200 hover:bg-white hover:text-gray-900 group-hover:translate-y-0"
                          aria-label="Sửa"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(b)}
                          className="translate-y-2 rounded-full bg-white/95 p-2 text-gray-700 shadow-md transition-all delay-[60ms] duration-200 hover:bg-white hover:text-red-600 group-hover:translate-y-0"
                          aria-label="Xoá"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-3.5">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100">
                        {b.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {b.author}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <FiCalendar size={11} /> {b.publishYear}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiMapPin size={11} /> {b.shelfLocation}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-app-border pt-2.5 text-[11px]">
                        <span className="inline-flex items-center gap-1 font-mono text-gray-400">
                          <FiLayers size={11} /> {b.bookCode}
                        </span>
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          {b.availableCopies}/{b.totalCopies}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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

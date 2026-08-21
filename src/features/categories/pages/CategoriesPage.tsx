import { useMemo, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFolder } from "react-icons/fi";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/useCategories";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import type { Category } from "@/features/categories/categories.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginationBar } from "@/components/ui/PaginationBar";

export default function CategoriesPage() {
  const { data, isLoading, isError } = useCategories();
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.categoryName.toLowerCase().includes(q));
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

  const openEdit = (c: Category) => {
    setEditing(c);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = (payload: { categoryName: string }) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.idCategory, payload },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(payload, { onSuccess: close });
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idCategory, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6  ">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Danh mục
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {total} danh mục
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
              placeholder="Tìm danh mục..."
              aria-label="Tìm danh mục"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500 sm:w-64"
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
          Không tải được danh sách danh mục.
        </p>
      )}
      {!isLoading && !isError && total === 0 && (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {search ? "Không tìm thấy danh mục phù hợp." : "Chưa có danh mục."}
        </p>
      )}

      {!isLoading && !isError && total > 0 && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((c) => (
              <div
                key={c.idCategory}
                className="group flex items-center gap-3 rounded-xl border border-app-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5  dark:hover:border-primary/40 dark:hover:bg-primary/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <FiFolder size={18} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {c.categoryName}
                </span>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="rounded-md p-2 text-gray-500 hover:bg-surface-3 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    aria-label="Sửa"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(c)}
                    className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    aria-label="Xoá"
                  >
                    <FiTrash2 size={16} />
                  </button>
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

      <CategoryFormModal
        open={open}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá danh mục"
        message={`Bạn có chắc muốn xoá danh mục "${deleting?.categoryName}"? Hành động này không thể hoàn tác.`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
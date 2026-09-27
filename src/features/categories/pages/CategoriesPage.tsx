import { useMemo, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiChevronRight,
  FiHome,
  FiEye,
  FiDownload,
  FiX,
} from "react-icons/fi";
import {
  useCategoryTree,
  useCategoryChildren,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/useCategories";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import type { Category } from "@/features/categories/categories.types";
import { useFilesByCategory } from "@/features/files/hooks/useFiles";
import type { FileResponse } from "@/features/files/files.types";
import { fileMeta } from "@/features/books/components/fileMeta";
import { FileViewer } from "@/features/books/components/FileViewer";
import { downloadFile } from "@/utils/download";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { StateView } from "@/components/ui/StateView";

type Crumb = { id: string; name: string };

export default function CategoriesPage() {
  const [path, setPath] = useState<Crumb[]>([]);
  const current = path.length ? path[path.length - 1] : null;

  const tree = useCategoryTree();
  const children = useCategoryChildren(current?.id ?? null);

  const active = current ? children : tree;
  const { data, isLoading, isError } = active;

  const files = useFilesByCategory(current?.id);

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [viewing, setViewing] = useState<FileResponse | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.categoryName.toLowerCase().includes(q));
  }, [data, search]);

  const openFolder = (c: Category) => {
    setPath((p) => [...p, { id: c.idCategory, name: c.categoryName }]);
    setSearch("");
    setViewing(null);
  };

  const goRoot = () => {
    setPath([]);
    setSearch("");
    setViewing(null);
  };

  const goCrumb = (index: number) => {
    setPath((p) => p.slice(0, index + 1));
    setSearch("");
    setViewing(null);
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

  const handleSubmit = (formData: {
    categoryName: string;
    parentCategory?: string;
    isDisplay: boolean;
  }) => {
    if (editing) {
      updateMut.mutate(
        {
          id: editing.idCategory,
          payload: { categoryName: formData.categoryName },
        },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(
        {
          categoryName: formData.categoryName,
          parentCategory: formData.parentCategory || current?.id || undefined,
          isDisplay: formData.isDisplay,
        },
        { onSuccess: close },
      );
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idCategory, {
      onSuccess: () => setDeleting(null),
    });
  };

  const fileList = files.data ?? [];
  const hasFiles = current && fileList.length > 0;

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <PageHeader
        icon={<FiFolder size={22} />}
        title="Danh mục"
        subtitle={
          current
            ? `Đang xem: ${current.name}`
            : "Quản lý cấu trúc danh mục thư viện"
        }
        action={
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm trong thư mục này..."
            />
            <Button leftIcon={<FiPlus size={16} />} onClick={openCreate}>
              Thêm
            </Button>
          </>
        }
      />

      <nav
        aria-label="Đường dẫn danh mục"
        className="mt-5 mb-5 flex flex-wrap items-center gap-1 rounded-xl border border-app-border bg-surface px-3 py-2 text-sm dark:bg-surface-3/40"
      >
        <button
          type="button"
          onClick={goRoot}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
            current
              ? "text-gray-500 hover:bg-surface-3 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
              : "bg-primary/10 text-primary dark:bg-primary/20"
          }`}
        >
          <FiHome size={14} /> Gốc
        </button>
        {path.map((c, i) => {
          const isLast = i === path.length - 1;
          return (
            <span key={c.id} className="flex items-center gap-1">
              <FiChevronRight
                size={14}
                className="text-gray-300 dark:text-gray-600"
              />
              <button
                type="button"
                onClick={() => goCrumb(i)}
                aria-current={isLast ? "page" : undefined}
                className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                  isLast
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-500 hover:bg-surface-3 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
                }`}
              >
                {c.name}
              </button>
            </span>
          );
        })}
      </nav>

      {viewing && (
        <div className="mb-6 rounded-2xl border border-app-border bg-surface p-4 dark:bg-surface-3/40">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
              {viewing.fileName}
            </p>
            <button
              type="button"
              onClick={() => setViewing(null)}
              aria-label="Đóng trình xem"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-surface-3 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <FiX size={18} />
            </button>
          </div>
          <FileViewer file={viewing} />
        </div>
      )}

      {(!current || (current && filtered.length > 0) || search) && (
        <section className="mb-6">
          {current && (
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Danh mục con
            </h2>
          )}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-app-border p-4"
                >
                  <span className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-surface-3" />
                  <span className="flex-1 space-y-2">
                    <span className="block h-3.5 w-3/4 animate-pulse rounded bg-surface-3" />
                    <span className="block h-2.5 w-1/3 animate-pulse rounded bg-surface-3" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <StateView
              isError={isError}
              isEmpty={filtered.length === 0}
              errorText="Không tải được danh sách danh mục."
              emptyText={
                search
                  ? "Không tìm thấy danh mục phù hợp."
                  : current
                    ? hasFiles
                      ? "Thư mục này chỉ chứa tệp, không có danh mục con."
                      : "Thư mục này chưa có danh mục con."
                    : "Chưa có danh mục."
              }
              emptyIcon={<FiFolder size={30} />}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((c) => {
                  return (
                    <div
                      key={c.idCategory}
                      className="group relative flex items-center gap-3 rounded-xl border border-app-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md dark:bg-surface-3/40 dark:hover:border-primary/50"
                    >
                      <button
                        type="button"
                        onClick={() => openFolder(c)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white dark:bg-primary/20">
                          <FiFolder size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {c.categoryName}
                          </span>
                        </span>
                        <FiChevronRight
                          size={16}
                          className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                      </button>
                      <div className="absolute right-3 top-3 flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="rounded-lg bg-surface-2 p-1.5 text-gray-500 shadow-sm hover:text-primary dark:bg-surface-3 dark:text-gray-400 dark:hover:text-primary"
                          aria-label="Sửa"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(c)}
                          className="rounded-lg bg-surface-2 p-1.5 text-gray-500 shadow-sm hover:text-red-600 dark:bg-surface-3 dark:text-gray-400 dark:hover:text-red-400"
                          aria-label="Xoá"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </StateView>
          )}
        </section>
      )}

      {current && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Tệp trong danh mục
            {fileList.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary dark:bg-primary/20">
                {fileList.length}
              </span>
            )}
          </h2>

          {files.isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl border border-app-border bg-surface-3"
                />
              ))}
            </div>
          ) : files.isError ? (
            <p className="rounded-xl border border-app-border bg-surface p-4 text-sm text-red-600 dark:bg-surface-3/40 dark:text-red-400">
              Không tải được danh sách tệp.
            </p>
          ) : fileList.length === 0 ? (
            <p className="rounded-xl border border-dashed border-app-border bg-surface p-4 text-sm text-gray-400 dark:bg-surface-3/40">
              Danh mục này chưa có tệp nào.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fileList.map((f) => {
                const meta = fileMeta(f.typeFile);
                const Icon = meta.icon;
                return (
                  <div
                    key={f.idFile}
                    className="group flex gap-3 rounded-2xl border border-app-border bg-surface p-3 transition-all hover:border-primary/40 hover:shadow-md dark:bg-surface-3/40"
                  >
                    {f.thumbnail ? (
                      <img
                        src={f.thumbnail}
                        alt={f.fileName}
                        loading="lazy"
                        className="h-24 w-20 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className={`flex h-24 w-20 shrink-0 items-center justify-center rounded-xl ${meta.box}`}
                      >
                        <Icon size={26} />
                      </span>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {f.fileName}
                      </p>
                      <span
                        className={`mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.box}`}
                      >
                        <Icon size={11} /> {f.typeFile}
                      </span>
                      <div className="mt-auto flex items-center gap-2 pt-3">
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<FiEye size={14} />}
                          onClick={() => setViewing(f)}
                          className="px-3 py-1.5 text-xs"
                        >
                          Xem
                        </Button>
                        <button
                          type="button"
                          onClick={() => downloadFile(f.partFile, f.fileName)}
                          className="inline-flex items-center gap-1 rounded-lg border border-app-border px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-surface-3 dark:text-gray-300"
                        >
                          <FiDownload size={14} /> Tải
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <CategoryFormModal
        open={open}
        editing={editing}
        categories={tree.data ?? []}
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

import { useMemo, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiChevronRight,
  FiHome,
  FiFile,
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
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { StateView } from "@/components/ui/StateView";
import { CategoryFilesModal } from "@/features/files/components/CategoryFilesModal";

type Crumb = { id: string; name: string };

export default function CategoriesPage() {
  const [path, setPath] = useState<Crumb[]>([]);
  const current = path.length ? path[path.length - 1] : null;

  const tree = useCategoryTree();
  const children = useCategoryChildren(current?.id ?? null);

  const active = current ? children : tree;
  const { data, isLoading, isError } = active;

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [filesOf, setFilesOf] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.categoryName.toLowerCase().includes(q));
  }, [data, search]);

  const openFolder = (c: Category) => {
    setPath((p) => [...p, { id: c.idCategory, name: c.categoryName }]);
    setSearch("");
  };

  const goRoot = () => {
    setPath([]);
    setSearch("");
  };

  const goCrumb = (index: number) => {
    setPath((p) => p.slice(0, index + 1));
    setSearch("");
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
          // mặc định tạo trong thư mục cha đang mở (nếu có)
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

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <PageHeader
        title="Danh mục"
        subtitle={current ? `Đang xem: ${current.name}` : "Danh mục gốc"}
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

      {/* Breadcrumb điều hướng */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm">
        <button
          type="button"
          onClick={goRoot}
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-surface-3 ${
            current
              ? "text-gray-500 dark:text-gray-400"
              : "font-medium text-primary"
          }`}
        >
          <FiHome size={14} /> Gốc
        </button>
        {path.map((c, i) => (
          <span key={c.id} className="flex items-center gap-1">
            <FiChevronRight size={14} className="text-gray-400" />
            <button
              type="button"
              onClick={() => goCrumb(i)}
              className={`rounded-md px-2 py-1 transition-colors hover:bg-surface-3 ${
                i === path.length - 1
                  ? "font-medium text-primary"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {c.name}
            </button>
          </span>
        ))}
      </nav>

      <StateView
        isLoading={isLoading}
        isError={isError}
        isEmpty={filtered.length === 0}
        errorText="Không tải được danh sách danh mục."
        emptyText={
          search
            ? "Không tìm thấy danh mục phù hợp."
            : current
              ? "Thư mục này chưa có danh mục con."
              : "Chưa có danh mục."
        }
        emptyIcon={<FiFolder size={30} />}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => {
            const hasChildren = (c.childCategory?.length ?? 0) > 0;
            return (
              <div
                key={c.idCategory}
                className="group flex items-center gap-3 rounded-xl border border-app-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:hover:border-primary/40 dark:hover:bg-primary/10"
              >
                <button
                  type="button"
                  onClick={() => openFolder(c)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                    <FiFolder size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                      {c.categoryName}
                    </span>
                    {hasChildren && (
                      <span className="text-xs text-gray-400">
                        {c.childCategory?.length} mục con
                      </span>
                    )}
                  </span>
                  <FiChevronRight
                    size={16}
                    className="shrink-0 text-gray-300 group-hover:text-primary"
                  />
                </button>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setFilesOf(c)}
                    className="rounded-md p-2 text-gray-500 hover:bg-surface-3 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    aria-label="Tệp"
                  >
                    <FiFile size={16} />
                  </button>
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
            );
          })}
        </div>
      </StateView>
      <CategoryFilesModal category={filesOf} onClose={() => setFilesOf(null)} />

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

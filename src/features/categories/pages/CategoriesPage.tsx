import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/categories/hooks/useCategories";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import type { Category } from "@/features/categories/categories.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function CategoriesPage() {
  const { data, isLoading, isError } = useCategories();
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setOpen(true);
  };
  const close = () => setOpen(false);

  const handleSubmit = (form: { categoryName: string }) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.idCategory, payload: form },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(form, { onSuccess: close });
    }
  };

  const handleDelete = (c: Category) => setDeleting(c);

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idCategory, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Danh mục</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <FiPlus size={16} /> Thêm danh mục
        </button>
      </div>

      {isLoading && (
        <p className="py-10 text-center text-sm text-gray-500">Đang tải...</p>
      )}

      {isError && (
        <p className="py-10 text-center text-sm text-red-600">
          Không tải được danh sách danh mục.
        </p>
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">
          Chưa có danh mục nào.
        </p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3 pr-4 font-medium">Tên danh mục</th>
                <th className="py-3 pl-4 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.idCategory} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-900">{c.categoryName}</td>
                  <td className="py-3 pl-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary"
                        aria-label="Sửa"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
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

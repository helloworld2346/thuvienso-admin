import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiLayers } from "react-icons/fi";
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "@/features/collections/hooks/useCollections";
import { CollectionFormModal } from "@/features/collections/components/CollectionFormModal";
import type { Collection } from "@/features/collections/collections.types";
import { COLLECTION_TYPE_LABELS } from "@/features/collections/collections.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function CollectionsPage() {
  const { data, isLoading, isError } = useCollections();
  const createMut = useCreateCollection();
  const updateMut = useUpdateCollection();
  const deleteMut = useDeleteCollection();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleting, setDeleting] = useState<Collection | null>(null);

  const list = data ?? [];

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (c: Collection) => {
    setEditing(c);
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleSubmit = (payload: {
    collectionName: string;
    typeCollection: Collection["typeCollection"];
  }) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.idCollection, payload },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(payload, { onSuccess: close });
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idCollection, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Bộ sưu tập
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {list.length} bộ sưu tập
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <FiPlus size={16} /> Thêm
        </button>
      </div>

      {isLoading && (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Đang tải...
        </p>
      )}
      {isError && (
        <p className="py-12 text-center text-sm text-red-600 dark:text-red-400">
          Không tải được danh sách bộ sưu tập.
        </p>
      )}
      {!isLoading && !isError && list.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Chưa có bộ sưu tập.
        </p>
      )}

      {!isLoading && !isError && list.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((c) => (
            <div
              key={c.idCollection}
              className="group flex items-center gap-3 rounded-xl border border-app-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:hover:border-primary/40 dark:hover:bg-primary/10"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                <FiLayers size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {c.collectionName}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {COLLECTION_TYPE_LABELS[c.typeCollection] ?? c.typeCollection}
                </p>
              </div>
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
      )}

      <CollectionFormModal
        open={open}
        editing={editing}
        submitting={createMut.isPending || updateMut.isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá bộ sưu tập"
        message={`Bạn có chắc muốn xoá bộ sưu tập "${deleting?.collectionName}"?`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

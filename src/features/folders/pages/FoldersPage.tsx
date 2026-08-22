import { useState } from "react";
import { FiPlus, FiTrash2, FiRotateCcw, FiFileText } from "react-icons/fi";
import {
  useRootFolders,
  useDeletedFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useRestoreFolder,
} from "@/features/folders/hooks/useFolders";
import {
  useDocumentsByFolder,
  useCreateDocument,
} from "@/features/documents/hooks/useDocuments";
import { FolderFormModal } from "@/features/folders/components/FolderFormModal";
import { FolderTreeNode } from "@/features/folders/components/FolderTreeNode";
import { DocumentFormModal } from "@/features/documents/components/DocumentFormModal";
import type { Folder } from "@/features/folders/folders.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function FoldersPage() {
  const { data: roots, isLoading } = useRootFolders();
  const { data: deleted } = useDeletedFolders();

  const createMut = useCreateFolder();
  const updateMut = useUpdateFolder();
  const deleteMut = useDeleteFolder();
  const restoreMut = useRestoreFolder();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Folder | null>(null);
  const [parent, setParent] = useState<Folder | null>(null);
  const [deleting, setDeleting] = useState<Folder | null>(null);
  const [selected, setSelected] = useState<Folder | null>(null);

  // Tài liệu trong folder đang chọn
  const { data: documents, isLoading: docsLoading } = useDocumentsByFolder(
    selected?.idFolder ?? "",
    !!selected,
  );
  const createDocMut = useCreateDocument();
  const [docOpen, setDocOpen] = useState(false);

  const openCreateRoot = () => {
    setEditing(null);
    setParent(null);
    setOpen(true);
  };
  const openAddChild = (p: Folder) => {
    setEditing(null);
    setParent(p);
    setOpen(true);
  };
  const openEdit = (f: Folder) => {
    setEditing(f);
    setParent(null);
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setEditing(null);
    setParent(null);
  };

  const handleSubmit = (data: { folderName: string; description?: string }) => {
    if (editing) {
      updateMut.mutate(
        { id: editing.idFolder, payload: { folderName: data.folderName } },
        { onSuccess: close },
      );
    } else {
      createMut.mutate(
        {
          folderName: data.folderName,
          description: data.description,
          parentFolder: parent?.idFolder,
        },
        { onSuccess: close },
      );
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idFolder, { onSuccess: () => setDeleting(null) });
  };

  const handleCreateDocument = (data: {
    title: string;
    content: string;
    typeDocument: Folder extends never ? never : string;
    status: string;
  }) => {
    if (!selected) return;
    createDocMut.mutate({ ...data, folderEntity: selected.idFolder } as never, {
      onSuccess: () => setDocOpen(false),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-app-border bg-surface-2 p-4 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Thư mục
          </h1>
          <button
            type="button"
            onClick={openCreateRoot}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <FiPlus size={16} /> Thêm
          </button>
        </div>

        {isLoading && (
          <p className="py-8 text-center text-sm text-gray-500">Đang tải...</p>
        )}
        <div className="space-y-0.5">
          {roots?.map((f) => (
            <FolderTreeNode
              key={f.idFolder}
              folder={f}
              level={0}
              selectedId={selected?.idFolder ?? null}
              onSelect={setSelected}
              onAddChild={openAddChild}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-app-border bg-surface-2 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Chi tiết
            </h2>
            {selected && (
              <button
                type="button"
                onClick={() => setDocOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                <FiPlus size={14} /> Thêm tài liệu
              </button>
            )}
          </div>

          {selected ? (
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selected.folderName}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {selected.description || "Không có mô tả"}
                </p>
              </div>

              <div>
                <h3 className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-gray-500">
                  <FiFileText size={13} /> Tài liệu
                </h3>
                {docsLoading ? (
                  <p className="text-sm text-gray-400">Đang tải...</p>
                ) : documents && documents.length > 0 ? (
                  <ul className="space-y-1">
                    {documents.map((d) => (
                      <li
                        key={d.idDocument}
                        className="truncate rounded-lg px-2 py-1.5 text-gray-700 hover:bg-surface-3 dark:text-gray-300"
                      >
                        {d.title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">
                    Chưa có tài liệu trong thư mục này.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Chọn một thư mục để xem chi tiết.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-app-border bg-surface-2 p-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FiTrash2 size={14} /> Thùng rác
          </h2>
          {deleted && deleted.length > 0 ? (
            <ul className="space-y-1">
              {deleted.map((f) => (
                <li
                  key={f.idFolder}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-surface-3"
                >
                  <span className="truncate text-gray-700 dark:text-gray-300">
                    {f.folderName}
                  </span>
                  <button
                    type="button"
                    onClick={() => restoreMut.mutate(f.idFolder)}
                    disabled={restoreMut.isPending}
                    className="flex items-center gap-1 rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-primary"
                    aria-label="Khôi phục"
                  >
                    <FiRotateCcw size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Trống.</p>
          )}
        </div>
      </div>

      <FolderFormModal
        open={open}
        editing={editing}
        parentName={parent?.folderName ?? null}
        submitting={createMut.isPending || updateMut.isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá thư mục"
        message={`Bạn có chắc muốn xoá thư mục "${deleting?.folderName}"?`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
      <DocumentFormModal
        open={docOpen}
        editing={null}
        submitting={createDocMut.isPending}
        onClose={() => setDocOpen(false)}
        onSubmit={handleCreateDocument}
      />
    </div>
  );
}

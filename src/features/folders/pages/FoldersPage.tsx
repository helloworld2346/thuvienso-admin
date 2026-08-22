import { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiRotateCcw,
  FiFileText,
  FiFolder,
} from "react-icons/fi";
import {
  useRootFolders,
  useDeletedFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useRestoreFolder,
  useMoveFolder,
} from "@/features/folders/hooks/useFolders";
import {
  useDocumentsByFolder,
  useCreateDocument,
  useMoveDocument,
} from "@/features/documents/hooks/useDocuments";
import { FolderFormModal } from "@/features/folders/components/FolderFormModal";
import { FolderTreeNode } from "@/features/folders/components/FolderTreeNode";
import {
  FolderContextMenu,
  type ContextMenuItem,
} from "@/features/folders/components/FolderContextMenu";
import { DocumentFormModal } from "@/features/documents/components/DocumentFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { StateView } from "@/components/ui/StateView";
import { useFoldersStore } from "@/features/folders/store/folders.store";
import { FOLDER_MOVE_ENABLED } from "@/features/folders/folders.config";
import { toast } from "@/store/toast.store";
import type { Folder } from "@/features/folders/folders.types";
import type { Document } from "@/features/documents/documents.types";

interface MenuState {
  x: number;
  y: number;
  folder: Folder;
}

export default function FoldersPage() {
  const { data: roots, isLoading, isError } = useRootFolders();
  const { data: deleted } = useDeletedFolders();

  const createMut = useCreateFolder();
  const updateMut = useUpdateFolder();
  const deleteMut = useDeleteFolder();
  const restoreMut = useRestoreFolder();
  const moveFolderMut = useMoveFolder();

  const createDocMut = useCreateDocument();
  const moveDocMut = useMoveDocument();

  const { clipboard, cutFolder, copyFolder, clearClipboard } =
    useFoldersStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Folder | null>(null);
  const [parent, setParent] = useState<Folder | null>(null);
  const [deleting, setDeleting] = useState<Folder | null>(null);
  const [selected, setSelected] = useState<Folder | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [docOpen, setDocOpen] = useState(false);

  const {
    data: documents,
    isLoading: docsLoading,
    isError: docsError,
  } = useDocumentsByFolder(selected?.idFolder ?? "", !!selected);

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
    typeDocument: Document["typeDocument"];
    status: Document["status"];
  }) => {
    if (!selected) return;
    createDocMut.mutate(
      { ...data, folderEntity: selected.idFolder },
      { onSuccess: () => setDocOpen(false) },
    );
  };

  // Di chuyển: chỉ gọi API khi backend đã có endpoint (FOLDER_MOVE_ENABLED)
  const moveFolderInto = (dragged: Folder, target: Folder) => {
    if (!FOLDER_MOVE_ENABLED) {
      toast.info("Di chuyển đang chờ backend bổ sung endpoint.");
      return;
    }
    moveFolderMut.mutate({
      id: dragged.idFolder,
      parentFolder: target.idFolder,
    });
  };

  const pasteInto = (target: Folder) => {
    if (!clipboard) return;
    if (!FOLDER_MOVE_ENABLED) {
      toast.info("Sao chép/di chuyển đang chờ backend bổ sung endpoint.");
      return;
    }
    if (clipboard.kind === "folder" && clipboard.folder) {
      moveFolderMut.mutate({
        id: clipboard.folder.idFolder,
        parentFolder: target.idFolder,
      });
    } else if (clipboard.kind === "document" && clipboard.document) {
      moveDocMut.mutate({
        id: clipboard.document.idDocument,
        folderEntity: target.idFolder,
      });
    }
    if (clipboard.mode === "cut") clearClipboard();
  };

  const menuItems = (f: Folder): ContextMenuItem[] => [
    { label: "Thư mục con mới", onClick: () => openAddChild(f) },
    {
      label: "Thêm tài liệu",
      onClick: () => {
        setSelected(f);
        setDocOpen(true);
      },
    },
    { label: "Đổi tên", onClick: () => openEdit(f) },
    { label: "Sao chép", onClick: () => copyFolder(f) },
    { label: "Cắt", onClick: () => cutFolder(f) },
    { label: "Dán vào đây", onClick: () => pasteInto(f), disabled: !clipboard },
    { label: "Xoá", onClick: () => setDeleting(f), danger: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-app-border bg-surface-2 p-4 lg:col-span-2">
        <div className="mb-3">
          <PageHeader
            title="Thư mục"
            icon={<FiFolder size={22} />}
            action={
              <Button
                size="sm"
                leftIcon={<FiPlus size={16} />}
                onClick={openCreateRoot}
              >
                Thêm
              </Button>
            }
          />
        </div>

        <StateView
          isLoading={isLoading}
          isError={isError}
          isEmpty={roots?.length === 0}
          errorText="Không tải được danh sách thư mục."
          emptyText="Chưa có thư mục nào."
          emptyIcon={<FiFolder size={30} />}
        >
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
                onContextMenu={(e, folder) => {
                  e.preventDefault();
                  setMenu({ x: e.clientX, y: e.clientY, folder });
                }}
                onDropFolder={moveFolderInto}
              />
            ))}
          </div>
        </StateView>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-app-border bg-surface-2 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Chi tiết
            </h2>
            {selected && (
              <Button
                size="sm"
                leftIcon={<FiPlus size={13} />}
                onClick={() => setDocOpen(true)}
                className="px-2.5 py-1.5 text-xs"
              >
                Thêm tài liệu
              </Button>
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

              <div className="border-t border-app-border pt-2">
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <FiFileText size={13} /> Tài liệu
                </p>
                <StateView
                  isLoading={docsLoading}
                  isError={docsError}
                  isEmpty={documents?.length === 0}
                  loadingText="Đang tải..."
                  errorText="Không tải được tài liệu."
                  emptyText="Chưa có tài liệu."
                >
                  <ul className="space-y-1">
                    {documents?.map((d) => (
                      <li
                        key={d.idDocument}
                        className="truncate rounded px-2 py-1 text-sm text-gray-700 hover:bg-surface-3 dark:text-gray-300"
                      >
                        {d.title}
                      </li>
                    ))}
                  </ul>
                </StateView>
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

      {menu && (
        <FolderContextMenu
          x={menu.x}
          y={menu.y}
          items={menuItems(menu.folder)}
          onClose={() => setMenu(null)}
        />
      )}

      <FolderFormModal
        open={open}
        editing={editing}
        parentName={parent?.folderName ?? null}
        submitting={createMut.isPending || updateMut.isPending}
        onClose={close}
        onSubmit={handleSubmit}
      />
      <DocumentFormModal
        open={docOpen}
        editing={null}
        submitting={createDocMut.isPending}
        onClose={() => setDocOpen(false)}
        onSubmit={handleCreateDocument}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá thư mục"
        message={`Bạn có chắc muốn xoá thư mục "${deleting?.folderName}"?`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

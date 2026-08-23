import { useRef, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiRotateCcw,
  FiFileText,
  FiFolder,
  FiUploadCloud,
  FiDownload,
  FiPaperclip,
  FiXCircle,
} from "react-icons/fi";
import {
  useRootFolders,
  useDeletedFolders,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useRestoreFolder,
  useMoveFolder,
  useCopyFolder,
  useHardDeleteFolder,
} from "@/features/folders/hooks/useFolders";
import {
  useDocumentsByFolder,
  useCreateDocument,
  useMoveDocument,
} from "@/features/documents/hooks/useDocuments";
import {
  useUploadFilesToFolder,
  useFilesByFolder,
} from "@/features/books/hooks/useFiles";
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
import {
  FOLDER_MOVE_ENABLED,
  FOLDER_COPY_ENABLED,
} from "@/features/folders/folders.config";
import { downloadFile } from "@/utils/download";
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
  const hardDeleteMut = useHardDeleteFolder();
  const restoreMut = useRestoreFolder();
  const moveFolderMut = useMoveFolder();
  const copyFolderMut = useCopyFolder();

  const createDocMut = useCreateDocument();
  const moveDocMut = useMoveDocument();

  const uploadFilesMut = useUploadFilesToFolder();

  const {
    clipboard,
    marked,
    toggleMark,
    clearMarks,
    cutFolder,
    copyFolder,
    clearClipboard,
  } = useFoldersStore();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Folder | null>(null);
  const [parent, setParent] = useState<Folder | null>(null);
  const [deleting, setDeleting] = useState<Folder | null>(null);
  const [hardDeleting, setHardDeleting] = useState<Folder | null>(null);
  const [selected, setSelected] = useState<Folder | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [dropActive, setDropActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: documents,
    isLoading: docsLoading,
    isError: docsError,
  } = useDocumentsByFolder(selected?.idFolder ?? "", !!selected);

  const {
    data: files,
    isLoading: filesLoading,
    isError: filesError,
  } = useFilesByFolder(selected?.idFolder);

  const isMarked = (f: Folder) =>
    marked.some((m) => m.folder.idFolder === f.idFolder);

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

  const confirmHardDelete = () => {
    if (!hardDeleting) return;
    hardDeleteMut.mutate(hardDeleting.idFolder, {
      onSuccess: () => setHardDeleting(null),
    });
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

  const handleUploadFiles = (idFolder: string, files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    uploadFilesMut.mutate({ idFolder, files: arr });
  };

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
    if (!clipboard || clipboard.entries.length === 0) return;

    if (clipboard.mode === "copy") {
      if (!FOLDER_COPY_ENABLED) {
        toast.info("Sao chép đang chờ backend bổ sung endpoint.");
        return;
      }
      let hasDoc = false;
      clipboard.entries.forEach((entry) => {
        if (entry.kind === "folder" && entry.folder) {
          copyFolderMut.mutate({
            id: entry.folder.idFolder,
            parentFolder: target.idFolder,
          });
        } else if (entry.kind === "document") {
          hasDoc = true;
        }
      });
      if (hasDoc)
        toast.info("Sao chép tài liệu đang chờ backend bổ sung endpoint.");
      return;
    }

    if (!FOLDER_MOVE_ENABLED) {
      toast.info("Di chuyển đang chờ backend bổ sung endpoint.");
      return;
    }
    clipboard.entries.forEach((entry) => {
      if (entry.kind === "folder" && entry.folder) {
        moveFolderMut.mutate({
          id: entry.folder.idFolder,
          parentFolder: target.idFolder,
        });
      } else if (entry.kind === "document" && entry.document) {
        moveDocMut.mutate({
          id: entry.document.idDocument,
          folderEntity: target.idFolder,
        });
      }
    });
    clearClipboard();
    clearMarks();
  };

  const menuItems = (f: Folder): ContextMenuItem[] => {
    const count = isMarked(f) && marked.length > 0 ? marked.length : 1;
    const items: ContextMenuItem[] = [
      { label: "Thư mục con mới", onClick: () => openAddChild(f) },
      {
        label: "Thêm tài liệu",
        onClick: () => {
          setSelected(f);
          setDocOpen(true);
        },
      },
      { label: "Đổi tên", onClick: () => openEdit(f) },
      {
        label: count > 1 ? `Sao chép (${count})` : "Sao chép",
        onClick: () => copyFolder(f),
      },
      {
        label: count > 1 ? `Cắt (${count})` : "Cắt",
        onClick: () => cutFolder(f),
      },
      {
        label: clipboard
          ? `Dán vào đây (${clipboard.entries.length})`
          : "Dán vào đây",
        onClick: () => pasteInto(f),
        disabled: !clipboard,
      },
      { label: "Xoá", onClick: () => setDeleting(f), danger: true },
    ];
    if (marked.length > 0)
      items.push({ label: "Bỏ chọn tất cả", onClick: () => clearMarks() });
    return items;
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-app-border bg-surface-2 p-4 lg:col-span-2">
        <div className="mb-3">
          <PageHeader
            title="Thư mục"
            icon={<FiFolder size={22} />}
            action={
              <div className="flex items-center gap-2">
                {marked.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearMarks}
                    className="px-2.5 py-1.5 text-xs"
                  >
                    Bỏ chọn ({marked.length})
                  </Button>
                )}
                <Button
                  size="sm"
                  leftIcon={<FiPlus size={16} />}
                  onClick={openCreateRoot}
                >
                  Thêm
                </Button>
              </div>
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
                ancestorIds={[]}
                selectedId={selected?.idFolder ?? null}
                isMarked={isMarked}
                onToggleMark={toggleMark}
                onSelect={setSelected}
                onAddChild={openAddChild}
                onEdit={openEdit}
                onDelete={setDeleting}
                onContextMenu={(e, folder) => {
                  e.preventDefault();
                  setMenu({ x: e.clientX, y: e.clientY, folder });
                }}
                onDropFolder={moveFolderInto}
                onUploadFiles={handleUploadFiles}
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

              <div className="border-t border-app-border pt-2">
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <FiPaperclip size={13} /> File
                </p>
                <StateView
                  isLoading={filesLoading}
                  isError={filesError}
                  isEmpty={files?.length === 0}
                  loadingText="Đang tải..."
                  errorText="Không tải được file."
                  emptyText="Chưa có file."
                >
                  <ul className="space-y-1">
                    {files?.map((f) => (
                      <li
                        key={f.idFile}
                        className="flex items-center justify-between gap-2 rounded px-2 py-1 text-sm hover:bg-surface-3"
                      >
                        <span className="truncate text-gray-700 dark:text-gray-300">
                          {f.fileName}
                        </span>
                        <button
                          type="button"
                          onClick={() => downloadFile(f.partFile, f.fileName)}
                          className="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-primary"
                          aria-label={`Tải file ${f.fileName}`}
                          title="Tải xuống"
                        >
                          <FiDownload size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </StateView>
              </div>

              <div className="border-t border-app-border pt-3">
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                  <FiUploadCloud size={13} /> Tải file lên
                </p>
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Tải file lên thư mục"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    if (e.dataTransfer.types.includes("Files")) {
                      e.preventDefault();
                      setDropActive(true);
                    }
                  }}
                  onDragLeave={() => setDropActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDropActive(false);
                    if (e.dataTransfer.files.length > 0)
                      handleUploadFiles(
                        selected.idFolder,
                        e.dataTransfer.files,
                      );
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-3 py-6 text-center transition-colors ${
                    dropActive
                      ? "border-primary bg-primary/10"
                      : "border-app-border hover:bg-surface-3"
                  }`}
                >
                  <FiUploadCloud
                    size={22}
                    className="text-gray-400 dark:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {uploadFilesMut.isPending
                      ? "Đang tải lên..."
                      : "Kéo-thả file vào đây hoặc bấm để chọn"}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  aria-hidden="true"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0)
                      handleUploadFiles(selected.idFolder, e.target.files);
                    e.target.value = "";
                  }}
                />
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
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => restoreMut.mutate(f.idFolder)}
                      disabled={restoreMut.isPending}
                      className="flex items-center gap-1 rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-primary"
                      aria-label="Khôi phục"
                      title="Khôi phục"
                    >
                      <FiRotateCcw size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHardDeleting(f)}
                      className="flex items-center gap-1 rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-red-500"
                      aria-label="Xoá vĩnh viễn"
                      title="Xoá vĩnh viễn"
                    >
                      <FiXCircle size={14} />
                    </button>
                  </div>
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
      <ConfirmDialog
        open={!!hardDeleting}
        title="Xoá vĩnh viễn thư mục"
        message={`Xoá vĩnh viễn "${hardDeleting?.folderName}"? Hành động này không thể hoàn tác.`}
        loading={hardDeleteMut.isPending}
        onConfirm={confirmHardDelete}
        onClose={() => setHardDeleting(null)}
      />
    </div>
  );
}

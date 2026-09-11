import { useRef, useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiRotateCcw,
  FiFolder,
  FiUploadCloud,
  FiXCircle,
} from "react-icons/fi";
import {
  useRootFolders,
  useDeletedFolders,
  useFolderChildren,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useRestoreFolder,
  useMoveFolder,
  useHardDeleteFolder,
} from "@/features/folders/hooks/useFolders";
import { useCreateDocument } from "@/features/documents/hooks/useDocuments";
import {
  useUploadFilesToFolder,
  useFilesByFolder,
  useDeleteFile,
  useHardDeleteFile,
  useDeletedFiles,
  useRestoreFile,
} from "@/features/files/hooks/useFiles";
import { useFolderNavigation } from "@/features/folders/hooks/useFolderNavigation";
import { useFolderClipboard } from "@/features/folders/hooks/useFolderClipboard";
import { FolderFormModal } from "@/features/folders/components/FolderFormModal";
import { FolderTreeNode } from "@/features/folders/components/FolderTreeNode";
import {
  FolderContextMenu,
  type ContextMenuItem,
} from "@/features/folders/components/FolderContextMenu";
import { FolderCard } from "@/features/folders/components/FolderCard";
import { FileCard } from "@/features/folders/components/FileCard";
import { FileRow } from "@/features/folders/components/FileRow";
import { FolderToolbar } from "@/features/folders/components/FolderToolbar";
import { DocumentFormModal } from "@/features/documents/components/DocumentFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { StateView } from "@/components/ui/StateView";
import { useFoldersStore } from "@/features/folders/store/folders.store";
import { FOLDER_MOVE_ENABLED } from "@/features/folders/folders.config";
import { downloadFile } from "@/utils/download";
import { toast } from "@/store/toast.store";
import type { Folder } from "@/features/folders/folders.types";
import type { Document } from "@/features/documents/documents.types";
import type { FileResponse } from "@/features/files/files.types";
import { FileViewerModal } from "@/features/folders/components/FileViewerModal";
import loginBg from "@/assets/images/bg-dongson.png";

interface MenuState {
  x: number;
  y: number;
  folder: Folder;
}

interface FileMenuState {
  x: number;
  y: number;
  file: FileResponse;
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

  const createDocMut = useCreateDocument();

  const uploadFilesMut = useUploadFilesToFolder();
  const deleteFileMut = useDeleteFile();
  const hardDeleteFileMut = useHardDeleteFile();
  const restoreFileMut = useRestoreFile();
  const { data: deletedFiles } = useDeletedFiles();
  const [hardDeletingFile, setHardDeletingFile] = useState<FileResponse | null>(
    null,
  );
  const [viewingFile, setViewingFile] = useState<FileResponse | null>(null);

  const { marked, viewMode, setViewMode, toggleMark, clearMarks } =
    useFoldersStore();

  const {
    currentFolder,
    trail,
    openFolder: navOpen,
    goCrumb,
  } = useFolderNavigation();
  const { clipboard, pasteInto, copyFolder, cutFolder, copyFile, cutFile } =
    useFolderClipboard();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Folder | null>(null);
  const [parent, setParent] = useState<Folder | null>(null);
  const [deleting, setDeleting] = useState<Folder | null>(null);
  const [hardDeleting, setHardDeleting] = useState<Folder | null>(null);
  const [selected, setSelected] = useState<Folder | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [fileMenu, setFileMenu] = useState<FileMenuState | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [dropActive, setDropActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: children,
    isLoading: childrenLoading,
    isError: childrenError,
  } = useFolderChildren(currentFolder?.idFolder ?? "", !!currentFolder);

  const { data: files } = useFilesByFolder(currentFolder?.idFolder);

  const folderList = currentFolder ? children : roots;
  const listLoading = currentFolder ? childrenLoading : isLoading;
  const listError = currentFolder ? childrenError : isError;

  const isMarked = (f: Folder) =>
    marked.some((m) => m.folder.idFolder === f.idFolder);

  const openFolder = (f: Folder) => {
    navOpen(f);
    setSelected(f);
  };

  const openCreateRoot = () => {
    setEditing(null);
    setParent(currentFolder);
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

  const handleUploadFiles = (idFolder: string, list: FileList | File[]) => {
    const arr = Array.from(list);
    if (arr.length === 0) return;
    uploadFilesMut.mutate({ idFolder, files: arr });
  };

  const triggerUpload = () => {
    if (!currentFolder) {
      toast.info("Hãy mở một thư mục trước khi tải file lên.");
      return;
    }
    fileInputRef.current?.click();
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
      {
        label: "Xoá",
        onClick: () => setDeleting(f),
        danger: true,
      },
    ];
    if (marked.length > 0)
      items.push({ label: "Bỏ chọn tất cả", onClick: () => clearMarks() });
    return items;
  };

  const openMenu = (e: React.MouseEvent, folder: Folder) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, folder });
  };

  const openFileMenu = (e: React.MouseEvent, file: FileResponse) => {
    e.preventDefault();
    setFileMenu({ x: e.clientX, y: e.clientY, file });
  };

  const fileMenuItems = (f: FileResponse): ContextMenuItem[] => [
    { label: "Xem", onClick: () => setViewingFile(f) },
    { label: "Sao chép", onClick: () => copyFile(f) },
    { label: "Cắt", onClick: () => cutFile(f) },
    { label: "Tải xuống", onClick: () => downloadFile(f.partFile, f.fileName) },
    {
      label: "Xoá",
      onClick: () => deleteFileMut.mutate(f.idFile),
      danger: true,
    },
  ];

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="flex min-h-0 flex-col gap-4">
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-app-border bg-surface-2 p-4">
          <div className="mb-3 flex shrink-0 items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <FiFolder size={16} /> Thư mục
            </h2>
            <Button
              size="sm"
              leftIcon={<FiPlus size={14} />}
              onClick={openCreateRoot}
              className="px-2.5 py-1.5 text-xs"
            >
              Thêm
            </Button>
          </div>
          <StateView
            isLoading={isLoading}
            isError={isError}
            isEmpty={roots?.length === 0}
            errorText="Không tải được danh sách thư mục."
            emptyText="Chưa có thư mục nào."
            emptyIcon={<FiFolder size={30} />}
          >
            <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1">
              {roots?.map((f) => (
                <FolderTreeNode
                  key={f.idFolder}
                  folder={f}
                  level={0}
                  ancestorIds={[]}
                  selectedId={currentFolder?.idFolder ?? null}
                  isMarked={isMarked}
                  onToggleMark={toggleMark}
                  onSelect={openFolder}
                  onAddChild={openAddChild}
                  onEdit={openEdit}
                  onDelete={setDeleting}
                  onContextMenu={openMenu}
                  onDropFolder={moveFolderInto}
                  onUploadFiles={handleUploadFiles}
                />
              ))}
            </div>
          </StateView>
        </div>

        <div className="flex max-h-56 shrink-0 flex-col rounded-2xl border border-app-border bg-surface-2 p-4">
          <h2 className="mb-2 flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <FiTrash2 size={14} /> Thùng rác
          </h2>
          {(deleted && deleted.length > 0) ||
          (deletedFiles && deletedFiles.length > 0) ? (
            <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {deleted?.map((f) => (
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
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-primary"
                      aria-label="Khôi phục"
                      title="Khôi phục"
                    >
                      <FiRotateCcw size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHardDeleting(f)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-red-500"
                      aria-label="Xoá vĩnh viễn"
                      title="Xoá vĩnh viễn"
                    >
                      <FiXCircle size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {deletedFiles?.map((f) => (
                <li
                  key={f.idFile}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-surface-3"
                >
                  <span className="truncate text-gray-700 dark:text-gray-300">
                    {f.fileName}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => restoreFileMut.mutate(f.idFile)}
                      disabled={restoreFileMut.isPending}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-primary"
                      aria-label="Khôi phục"
                      title="Khôi phục"
                    >
                      <FiRotateCcw size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHardDeletingFile(f)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-muted hover:text-red-500"
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
      </aside>

      <section
        className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-app-border bg-surface-2 p-4"
        onDragOver={(e) => {
          if (currentFolder && e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            setDropActive(true);
          }
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDropActive(false);
          if (currentFolder && e.dataTransfer.files.length > 0)
            handleUploadFiles(currentFolder.idFolder, e.dataTransfer.files);
        }}
      >
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${loginBg})`,
              backgroundSize: "60% auto",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="pointer-events-none absolute inset-0" />
        </>
        <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4">
          <div className="shrink-0">
            <FolderToolbar
              trail={trail}
              viewMode={viewMode}
              onSetView={setViewMode}
              onCrumb={goCrumb}
              onAdd={openCreateRoot}
              onUpload={triggerUpload}
            />
          </div>

          {dropActive && (
            <div className="shrink-0 rounded-xl border border-dashed border-primary bg-primary/10 px-3 py-6 text-center text-sm text-primary">
              <FiUploadCloud className="mx-auto mb-1" size={22} />
              Thả file để tải lên "{currentFolder?.folderName}"
            </div>
          )}

          {files && files.length > 0 && (
            <div className="shrink-0">
              <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                File gần đây
              </h3>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {files.map((f) => (
                    <div
                      key={f.idFile}
                      onContextMenu={(e) => openFileMenu(e, f)}
                      onDoubleClick={() => setViewingFile(f)}
                    >
                      <FileCard file={f} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {files.map((f) => (
                    <div
                      key={f.idFile}
                      onContextMenu={(e) => openFileMenu(e, f)}
                      onDoubleClick={() => setViewingFile(f)}
                    >
                      <FileRow file={f} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <StateView
              isLoading={listLoading}
              isError={listError}
              isEmpty={folderList?.length === 0}
              errorText="Không tải được danh sách thư mục."
              emptyText="Thư mục trống."
              emptyIcon={<FiFolder size={30} />}
            >
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col gap-2"
                }
              >
                {folderList?.map((f) => (
                  <FolderCard
                    key={f.idFolder}
                    folder={f}
                    selected={selected?.idFolder === f.idFolder}
                    onOpen={openFolder}
                    onMenu={openMenu}
                  />
                ))}
              </div>
            </StateView>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            aria-hidden="true"
            onChange={(e) => {
              if (currentFolder && e.target.files && e.target.files.length > 0)
                handleUploadFiles(currentFolder.idFolder, e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </section>

      {menu && (
        <FolderContextMenu
          x={menu.x}
          y={menu.y}
          items={menuItems(menu.folder)}
          onClose={() => setMenu(null)}
        />
      )}

      {fileMenu && (
        <FolderContextMenu
          x={fileMenu.x}
          y={fileMenu.y}
          items={fileMenuItems(fileMenu.file)}
          onClose={() => setFileMenu(null)}
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
      <ConfirmDialog
        open={!!hardDeletingFile}
        title="Xoá vĩnh viễn file"
        message={`Xoá vĩnh viễn "${hardDeletingFile?.fileName}"? Hành động này không thể hoàn tác.`}
        loading={hardDeleteFileMut.isPending}
        onConfirm={() => {
          if (hardDeletingFile)
            hardDeleteFileMut.mutate(hardDeletingFile.idFile);
          setHardDeletingFile(null);
        }}
        onClose={() => setHardDeletingFile(null)}
      />
      <FileViewerModal
        file={viewingFile}
        onClose={() => setViewingFile(null)}
      />
    </div>
  );
}

import { useMemo, useRef, useState } from "react";
import {
  FiTrash2,
  FiFolder,
  FiUploadCloud,
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
import { FolderToolbar } from "@/features/folders/components/FolderToolbar";
import { DocumentFormModal } from "@/features/documents/components/DocumentFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StateView } from "@/components/ui/StateView";
import { useFoldersStore } from "@/features/folders/store/folders.store";
import { FOLDER_MOVE_ENABLED } from "@/features/folders/folders.config";
import { downloadFile } from "@/utils/download";
import { toast } from "@/store/toast.store";
import type { Folder } from "@/features/folders/folders.types";
import type { Document } from "@/features/documents/documents.types";
import type { FileResponse } from "@/features/files/files.types";
import { FileViewerModal } from "@/features/folders/components/FileViewerModal";
import { FolderStats } from "@/features/folders/components/FolderStats";
import { EntryTable } from "@/features/folders/components/EntryTable";
import { DeletedTable } from "@/features/folders/components/DeletedTable";
import {
  DetailPanel,
  type Detail,
} from "@/features/folders/components/DetailPanel";
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
  const [detail, setDetail] = useState<Detail | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [fileMenu, setFileMenu] = useState<FileMenuState | null>(null);
    const [bgMenu, setBgMenu] = useState<{ x: number; y: number } | null>(null);
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
  const trashCount = (deleted?.length ?? 0) + (deletedFiles?.length ?? 0);

  const stats = useMemo(
    () => ({
      folderCount: folderList?.length ?? 0,
      fileCount: files?.length ?? 0,
      totalSize: (files ?? []).reduce((sum, f) => sum + (f.size ?? 0), 0),
      trashCount: (deleted?.length ?? 0) + (deletedFiles?.length ?? 0),
    }),
    [folderList, files, deleted, deletedFiles],
  );

  const isMarked = (f: Folder) =>
    marked.some((m) => m.folder.idFolder === f.idFolder);

  const openFolder = (f: Folder) => {
    navOpen(f);
    setSelected(f);
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
          visibility: true,
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
    if (uploadFilesMut.isPending) return;
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
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, folder });
  };

  const openFileMenu = (e: React.MouseEvent, file: FileResponse) => {
    e.preventDefault();
    e.stopPropagation();
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

  const openBgMenu = (e: React.MouseEvent) => {
    if (!currentFolder) return;
    e.preventDefault();
    setBgMenu({ x: e.clientX, y: e.clientY });
  };

  const bgMenuItems = (): ContextMenuItem[] => [
    {
      label: "Thư mục con mới",
      onClick: () => {
        if (currentFolder) openAddChild(currentFolder);
      },
    },
    {
      label: clipboard
        ? `Dán vào đây (${clipboard.entries.length})`
        : "Dán vào đây",
      onClick: () => {
        if (currentFolder) pasteInto(currentFolder);
      },
      disabled: !clipboard,
    },
    { label: "Tải lên", onClick: () => triggerUpload() },
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_300px]">
        <aside className="flex min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-app-border bg-surface-2 p-4">
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h2 className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FiFolder size={16} /> Thư mục
              </h2>
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
                    onContextMenu={openMenu}
                    onDropFolder={moveFolderInto}
                    onUploadFiles={handleUploadFiles}
                  />
                ))}
              </div>
            </StateView>
          </div>
        </aside>

        <section
          className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-app-border bg-surface-2 p-4"
          onContextMenu={openBgMenu}
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
          <div className="relative z-10 flex min-h-0 flex-1 flex-col space-y-4">
            <div className="shrink-0">
              <FolderToolbar
                trail={trail}
                viewMode={viewMode}
                onSetView={setViewMode}
                onCrumb={goCrumb}
                onUpload={triggerUpload}
              />
            </div>

            {dropActive && (
              <div className="shrink-0 rounded-xl border border-dashed border-primary bg-primary/10 px-3 py-6 text-center text-sm text-primary">
                <FiUploadCloud className="mx-auto mb-1" size={22} />
                Thả file để tải lên "{currentFolder?.folderName}"
              </div>
            )}
            {uploadFilesMut.isPending && (
              <div className="shrink-0 flex items-center space-x-3 rounded-xl border border-app-border bg-surface-2 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                <svg
                  className="h-4 w-4 animate-spin text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Đang tải file lên
                {currentFolder ? ` "${currentFolder.folderName}"` : ""}…
              </div>
            )}

            <FolderStats
              folderCount={stats.folderCount}
              fileCount={stats.fileCount}
              totalSize={stats.totalSize}
              trashCount={stats.trashCount}
            />

            {viewMode === "grid" ? (
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                {files && files.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      File gần đây
                    </h3>
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
                  </div>
                )}

                <StateView
                  isLoading={listLoading}
                  isError={listError}
                  isEmpty={
                    folderList?.length === 0 && (!files || files.length === 0)
                  }
                  errorText="Không tải được danh sách thư mục."
                  emptyText="Thư mục trống."
                  emptyIcon={<FiFolder size={30} />}
                >
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
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
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <StateView
                  isLoading={listLoading}
                  isError={listError}
                  isEmpty={
                    folderList?.length === 0 && (!files || files.length === 0)
                  }
                  errorText="Không tải được danh sách thư mục."
                  emptyText="Thư mục trống."
                  emptyIcon={<FiFolder size={30} />}
                >
                  <EntryTable
                    folders={folderList ?? []}
                    files={files ?? []}
                    selectedId={selected?.idFolder}
                    onOpenFolder={openFolder}
                    onFolderMenu={openMenu}
                    onViewFile={setViewingFile}
                    onFileMenu={openFileMenu}
                  />
                </StateView>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              aria-hidden="true"
              onChange={(e) => {
                if (
                  currentFolder &&
                  e.target.files &&
                  e.target.files.length > 0
                )
                  handleUploadFiles(currentFolder.idFolder, e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </section>
        <aside className="hidden min-h-0 flex-col overflow-hidden rounded-2xl border border-app-border bg-surface-2 xl:flex">
          <DetailPanel
            detail={detail}
            onClose={() => setDetail(null)}
            onOpenFolder={(f) => openFolder(f)}
            onRenameFolder={(f) => openEdit(f)}
            onDeleteFolder={(f) => setDeleting(f)}
            onViewFile={(f) => setViewingFile(f)}
            onDeleteFile={(f) => deleteFileMut.mutate(f.idFile)}
          />
        </aside>
      </div>

      <div className="shrink-0 rounded-2xl border border-app-border bg-surface-2 p-4">
        <h2 className="mb-2 flex shrink-0 items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <FiTrash2 size={14} /> Thùng rác
          {trashCount > 0 && (
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
              {trashCount}
            </span>
          )}
        </h2>
        {trashCount > 0 ? (
          <DeletedTable
            folders={deleted ?? []}
            files={deletedFiles ?? []}
            onRestoreFolder={(f) => restoreMut.mutate(f.idFolder)}
            onHardDeleteFolder={(f) => setHardDeleting(f)}
            onRestoreFile={(f) => restoreFileMut.mutate(f.idFile)}
            onHardDeleteFile={(f) => setHardDeletingFile(f)}
            restoring={restoreMut.isPending || restoreFileMut.isPending}
          />
        ) : (
          <div className="flex items-center justify-center space-x-2 py-6 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-gray-300 dark:text-gray-600">
              <FiTrash2 size={18} />
            </span>
            <p className="text-xs text-gray-400">Thùng rác trống</p>
          </div>
        )}
      </div>

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

      {bgMenu && (
        <FolderContextMenu
          x={bgMenu.x}
          y={bgMenu.y}
          items={bgMenuItems()}
          onClose={() => setBgMenu(null)}
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

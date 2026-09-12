import {
  FiFolder,
  FiDownload,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
} from "react-icons/fi";
import type { Folder } from "@/features/folders/folders.types";
import type { FileResponse } from "@/features/files/files.types";
import { fileMeta } from "@/features/books/components/fileMeta";
import { folderStyle } from "@/features/folders/components/folderPalette";
import { formatSize, formatRelative } from "@/features/folders/folders.format";
import { downloadFile } from "@/utils/download";

export type Detail =
  | { kind: "folder"; folder: Folder }
  | { kind: "file"; file: FileResponse };

interface DetailPanelProps {
  detail: Detail | null;
  onClose: () => void;
  onOpenFolder: (f: Folder) => void;
  onRenameFolder: (f: Folder) => void;
  onDeleteFolder: (f: Folder) => void;
  onViewFile: (f: FileResponse) => void;
  onDeleteFile: (f: FileResponse) => void;
}

export function DetailPanel({
  detail,
  onClose,
  onOpenFolder,
  onRenameFolder,
  onDeleteFolder,
  onViewFile,
  onDeleteFile,
}: DetailPanelProps) {
  if (!detail) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-3 p-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-3 text-gray-400">
          <FiEye size={26} />
        </span>
        <p className="text-sm text-gray-400">
          Chọn một thư mục hoặc file để xem chi tiết.
        </p>
      </div>
    );
  }

  if (detail.kind === "folder") {
    const f = detail.folder;
    const style = folderStyle(f.idFolder);
    return (
      <div className="flex h-full flex-col">
        <Header onClose={onClose} />
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div
            className={`mb-4 flex h-40 w-full items-center justify-center rounded-2xl ${style.box}`}
          >
            <FiFolder size={56} />
          </div>
          <h3 className="mb-1 break-words text-base font-semibold text-gray-900 dark:text-gray-100">
            {f.folderName}
          </h3>
          {f.description && (
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              {f.description}
            </p>
          )}
          <dl className="space-y-2 text-sm">
            <Row label="Loại" value="Thư mục" />
            <Row
              label="Số mục"
              value={f.itemCount != null ? `${f.itemCount} mục` : "—"}
            />
            <Row label="Sửa đổi" value={formatRelative(f.updatedAt)} />
          </dl>
        </div>
        <div className="flex flex-col space-y-2 border-t border-app-border p-4">
          <ActionButton
            icon={<FiFolder size={16} />}
            label="Mở"
            onClick={() => onOpenFolder(f)}
          />
          <ActionButton
            icon={<FiEdit2 size={16} />}
            label="Đổi tên"
            onClick={() => onRenameFolder(f)}
          />
          <ActionButton
            icon={<FiTrash2 size={16} />}
            label="Xoá"
            danger
            onClick={() => onDeleteFolder(f)}
          />
        </div>
      </div>
    );
  }

  const file = detail.file;
  const meta = fileMeta(file.typeFile);
  const Icon = meta.icon;
  return (
    <div className="flex h-full flex-col">
      <Header onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl">
          {file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.fileName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className={`flex h-full w-full items-center justify-center ${meta.box}`}
            >
              <Icon size={56} />
            </span>
          )}
        </div>
        <h3 className="mb-3 break-words text-base font-semibold text-gray-900 dark:text-gray-100">
          {file.fileName}
        </h3>
        <dl className="space-y-2 text-sm">
          <Row label="Loại" value={file.typeFile} />
          <Row label="Kích thước" value={formatSize(file.size)} />
          <Row label="Ngày tạo" value={formatRelative(file.createdAt)} />
        </dl>
      </div>
      <div className="flex flex-col space-y-2 border-t border-app-border p-4">
        <ActionButton
          icon={<FiEye size={16} />}
          label="Xem"
          onClick={() => onViewFile(file)}
        />
        <ActionButton
          icon={<FiDownload size={16} />}
          label="Tải xuống"
          onClick={() => downloadFile(file.partFile, file.fileName)}
        />
        <ActionButton
          icon={<FiTrash2 size={16} />}
          label="Xoá"
          danger
          onClick={() => onDeleteFile(file)}
        />
      </div>
    </div>
  );
}

function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-app-border px-4 py-3">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Chi tiết
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1.5 text-gray-400 hover:bg-surface-3 hover:text-gray-700 dark:hover:text-gray-200"
        aria-label="Đóng"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between space-x-3">
      <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="truncate font-medium text-gray-900 dark:text-gray-100">
        {value}
      </dd>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center space-x-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          : "text-gray-700 hover:bg-surface-3 dark:text-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

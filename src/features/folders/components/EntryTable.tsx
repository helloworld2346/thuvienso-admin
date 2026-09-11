import { FiFolder, FiDownload, FiMoreVertical } from "react-icons/fi";
import type { Folder } from "@/features/folders/folders.types";
import type { FileResponse } from "@/features/files/files.types";
import { fileMeta } from "@/features/books/components/fileMeta";
import { folderStyle } from "@/features/folders/components/folderPalette";
import { formatSize, formatRelative } from "@/features/folders/folders.format";
import { downloadFile } from "@/utils/download";

interface EntryTableProps {
  folders: Folder[];
  files: FileResponse[];
  selectedId?: string | null;
  onOpenFolder: (f: Folder) => void;
  onFolderMenu: (e: React.MouseEvent, f: Folder) => void;
  onViewFile: (f: FileResponse) => void;
  onFileMenu: (e: React.MouseEvent, f: FileResponse) => void;
}

export function EntryTable({
  folders,
  files,
  selectedId,
  onOpenFolder,
  onFolderMenu,
  onViewFile,
  onFileMenu,
}: EntryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-app-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-app-border text-left text-xs uppercase text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">Tên</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Loại</th>
            <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">
              Kích thước
            </th>
            <th className="hidden px-4 py-3 text-right font-medium md:table-cell">
              Sửa đổi
            </th>
            <th className="px-4 py-3 text-right font-medium">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((f) => {
            const style = folderStyle(f.idFolder);
            return (
              <tr
                key={f.idFolder}
                onDoubleClick={() => onOpenFolder(f)}
                onContextMenu={(e) => onFolderMenu(e, f)}
                className={`group cursor-pointer border-b border-app-border/60 transition-colors hover:bg-surface-3 ${
                  selectedId === f.idFolder ? "bg-primary/5" : ""
                }`}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.box}`}
                    >
                      <FiFolder size={16} />
                    </span>
                    <span className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {f.folderName}
                    </span>
                  </div>
                </td>
                <td className="hidden px-4 py-2.5 text-gray-500 dark:text-gray-400 sm:table-cell">
                  Thư mục
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 sm:table-cell">
                  {f.itemCount != null ? `${f.itemCount} mục` : "—"}
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 md:table-cell">
                  {formatRelative(f.updatedAt)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    type="button"
                    onClick={(e) => onFolderMenu(e, f)}
                    className="rounded-md p-1.5 text-gray-400 hover:bg-surface-3 hover:text-gray-700 dark:hover:text-gray-200"
                    aria-label="Tuỳ chọn"
                  >
                    <FiMoreVertical size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
          {files.map((f) => {
            const meta = fileMeta(f.typeFile);
            const Icon = meta.icon;
            return (
              <tr
                key={f.idFile}
                onDoubleClick={() => onViewFile(f)}
                onContextMenu={(e) => onFileMenu(e, f)}
                className="group cursor-pointer border-b border-app-border/60 transition-colors hover:bg-surface-3"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.box}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="truncate font-medium text-gray-900 dark:text-gray-100">
                      {f.fileName}
                    </span>
                  </div>
                </td>
                <td className="hidden px-4 py-2.5 sm:table-cell">
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${meta.box}`}
                  >
                    {f.typeFile}
                  </span>
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 sm:table-cell">
                  {formatSize(f.size)}
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 md:table-cell">
                  {formatRelative(f.createdAt)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => downloadFile(f.partFile, f.fileName)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-surface-3 hover:text-primary"
                      aria-label={`Tải ${f.fileName}`}
                    >
                      <FiDownload size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => onFileMenu(e, f)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-surface-3 hover:text-gray-700 dark:hover:text-gray-200"
                      aria-label="Tuỳ chọn"
                    >
                      <FiMoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

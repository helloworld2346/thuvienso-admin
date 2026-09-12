import { FiFolder, FiRotateCcw, FiXCircle } from "react-icons/fi";
import type { Folder } from "@/features/folders/folders.types";
import type { FileResponse } from "@/features/files/files.types";
import { fileMeta } from "@/features/books/components/fileMeta";
import { folderStyle } from "@/features/folders/components/folderPalette";
import {
  formatSize,
  formatDate,
  formatRemaining,
} from "@/features/folders/folders.format";

interface DeletedTableProps {
  folders: Folder[];
  files: FileResponse[];
  onRestoreFolder: (f: Folder) => void;
  onHardDeleteFolder: (f: Folder) => void;
  onRestoreFile: (f: FileResponse) => void;
  onHardDeleteFile: (f: FileResponse) => void;
  restoring?: boolean;
}

export function DeletedTable({
  folders,
  files,
  onRestoreFolder,
  onHardDeleteFolder,
  onRestoreFile,
  onHardDeleteFile,
  restoring = false,
}: DeletedTableProps) {
  return (
    <div className="max-h-64 overflow-auto rounded-xl border border-app-border bg-surface">
      <table className="w-full min-w-[640px] table-fixed text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-app-border text-left text-xs uppercase text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3 font-medium">Tên</th>
            <th className="hidden w-24 px-4 py-3 font-medium sm:table-cell">
              Loại
            </th>
            <th className="hidden w-28 px-4 py-3 text-right font-medium sm:table-cell">
              Kích thước
            </th>
            <th className="hidden w-32 px-4 py-3 text-right font-medium md:table-cell">
              Ngày xóa
            </th>
            <th className="hidden w-36 px-4 py-3 text-right font-medium lg:table-cell">
              Thời gian còn lại
            </th>
            <th className="w-24 px-4 py-3 text-right font-medium">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((f) => {
            const style = folderStyle(f.idFolder);
            return (
              <tr
                key={f.idFolder}
                className="border-b border-app-border/60 transition-colors hover:bg-surface-3"
              >
                <td className="max-w-0 px-4 py-2.5">
                  <div className="flex min-w-0 items-center space-x-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.box}`}
                    >
                      <FiFolder size={16} />
                    </span>
                    <span
                      className="truncate font-medium text-gray-900 dark:text-gray-100"
                      title={f.folderName}
                    >
                      {f.folderName}
                    </span>
                  </div>
                </td>
                <td className="hidden px-4 py-2.5 text-gray-500 dark:text-gray-400 sm:table-cell">
                  Thư mục
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 sm:table-cell">
                  {formatSize(f.size)}
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 md:table-cell">
                  {formatDate(f.deletedAt)}
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 lg:table-cell">
                  {formatRemaining(f.expireAt)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      type="button"
                      onClick={() => onRestoreFolder(f)}
                      disabled={restoring}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-3 hover:text-primary disabled:opacity-50"
                      aria-label="Khôi phục"
                      title="Khôi phục"
                    >
                      <FiRotateCcw size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onHardDeleteFolder(f)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-3 hover:text-red-500"
                      aria-label="Xoá vĩnh viễn"
                      title="Xoá vĩnh viễn"
                    >
                      <FiXCircle size={15} />
                    </button>
                  </div>
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
                className="border-b border-app-border/60 transition-colors hover:bg-surface-3"
              >
                <td className="max-w-0 px-4 py-2.5">
                  <div className="flex min-w-0 items-center space-x-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.box}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span
                      className="truncate font-medium text-gray-900 dark:text-gray-100"
                      title={f.fileName}
                    >
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
                  {formatDate(f.deletedAt)}
                </td>
                <td className="hidden px-4 py-2.5 text-right text-gray-500 dark:text-gray-400 lg:table-cell">
                  {formatRemaining(f.expireAt)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      type="button"
                      onClick={() => onRestoreFile(f)}
                      disabled={restoring}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-3 hover:text-primary disabled:opacity-50"
                      aria-label="Khôi phục"
                      title="Khôi phục"
                    >
                      <FiRotateCcw size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onHardDeleteFile(f)}
                      className="rounded-md p-1.5 text-gray-500 hover:bg-surface-3 hover:text-red-500"
                      aria-label="Xoá vĩnh viễn"
                      title="Xoá vĩnh viễn"
                    >
                      <FiXCircle size={15} />
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

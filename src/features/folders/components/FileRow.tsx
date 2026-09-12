import { FiDownload } from "react-icons/fi";
import { downloadFile } from "@/utils/download";
import { formatSize, formatRelative } from "@/features/folders/folders.format";
import { fileMeta } from "@/features/books/components/fileMeta";
import type { FileResponse } from "@/features/files/files.types";

export function FileRow({ file }: { file: FileResponse }) {
  const meta = fileMeta(file.typeFile);
  const Icon = meta.icon;
  return (
    <div className="group flex items-center space-x-3 rounded-lg border border-app-border bg-surface px-3 py-2 transition-colors hover:border-primary/40 hover:bg-surface-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.box}`}
      >
        <Icon size={18} />
      </span>

      <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
        {file.fileName}
      </p>

      <span
        className={`hidden shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase sm:inline ${meta.box}`}
      >
        {file.typeFile}
      </span>

      <span className="hidden w-20 shrink-0 text-right text-xs text-gray-500 dark:text-gray-400 sm:block">
        {formatSize(file.size)}
      </span>

      <span className="hidden w-28 shrink-0 text-right text-xs text-gray-500 dark:text-gray-400 md:block">
        {formatRelative(file.createdAt)}
      </span>

      <button
        type="button"
        onClick={() => downloadFile(file.partFile, file.fileName)}
        className="shrink-0 rounded-md p-1.5 text-gray-400 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
        aria-label={`Tải ${file.fileName}`}
      >
        <FiDownload size={15} />
      </button>
    </div>
  );
}

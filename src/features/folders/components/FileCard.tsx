import { FiDownload } from "react-icons/fi";
import { downloadFile } from "@/utils/download";
import { formatSize, formatRelative } from "@/features/folders/folders.format";
import { fileMeta } from "@/features/books/components/fileMeta";
import type { FileResponse } from "@/features/files/files.types";

export function FileCard({ file }: { file: FileResponse }) {
  const meta = fileMeta(file.typeFile);
  const Icon = meta.icon;
  return (
    <div className="group flex flex-col space-y-2 rounded-2xl border border-app-border bg-surface p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 pt-[56.25%] dark:bg-surface-3">
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.fileName}
            loading="lazy"
            className="absolute left-0 top-0 h-full w-full object-cover"
          />
        ) : (
          <span
            className={`absolute left-0 top-0 flex h-full w-full items-center justify-center ${meta.box}`}
          >
            <Icon size={28} />
          </span>
        )}
        <span
          className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${meta.box}`}
        >
          {file.typeFile}
        </span>
        <button
          type="button"
          onClick={() => downloadFile(file.partFile, file.fileName)}
          className="absolute right-2 top-2 rounded-md bg-white/80 p-1.5 text-gray-600 opacity-0 transition-opacity hover:text-primary group-hover:opacity-100 dark:bg-black/50"
          aria-label={`Tải ${file.fileName}`}
        >
          <FiDownload size={14} />
        </button>
      </div>
      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
        {file.fileName}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{formatSize(file.size)}</span>
        <span>{formatRelative(file.createdAt)}</span>
      </div>
    </div>
  );
}

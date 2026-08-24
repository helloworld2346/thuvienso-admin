import { FiFile, FiDownload } from "react-icons/fi";
import { downloadFile } from "@/utils/download";
import { formatSize, formatRelative } from "@/features/folders/folders.format";
import type { FileResponse } from "@/features/books/books.types";

export function FileCard({ file }: { file: FileResponse }) {
  return (
    <div className="group flex flex-col gap-2 rounded-2xl border border-app-border bg-surface p-3 transition-all hover:border-primary/40 hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-surface-3">
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.fileName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-primary">
            <FiFile size={28} />
          </span>
        )}
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

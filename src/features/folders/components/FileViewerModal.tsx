import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import type { FileResponse } from "@/features/files/files.types";
import { FileViewer } from "@/features/books/components/FileViewer";
import { useModalA11y } from "@/hooks/useModalA11y";

interface Props {
  file: FileResponse | null;
  onClose: () => void;
}

export function FileViewerModal({ file, onClose }: Props) {
  const panelRef = useModalA11y<HTMLDivElement>({ open: !!file, onClose });
  if (!file) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Xem ${file.fileName}`}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-surface-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="flex shrink-0 items-center justify-between space-x-2 border-b border-app-border px-6 py-4">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {file.fileName}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-surface-3 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <FileViewer file={file} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

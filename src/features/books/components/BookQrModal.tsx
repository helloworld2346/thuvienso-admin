import { createPortal } from "react-dom";
import { FiX, FiDownload, FiMaximize } from "react-icons/fi";
import type { Book } from "@/features/books/books.types";
import { useModalA11y } from "@/hooks/useModalA11y";
import { downloadFile } from "@/utils/download";

interface Props {
  book: Book | null;
  onClose: () => void;
}

export function BookQrModal({ book, onClose }: Props) {
  const panelRef = useModalA11y<HTMLDivElement>({ open: !!book, onClose });
  if (!book) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-qr-title"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-surface-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4">
          <h2
            id="book-qr-title"
            className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100"
          >
            Mã QR · {book.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-surface-3 hover:text-gray-900 dark:text-gray-400"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 p-6">
          {book.qrCode ? (
            <img
              src={book.qrCode}
              alt={`Mã QR sách ${book.title}`}
              className="h-56 w-56 rounded-2xl border border-app-border bg-white object-contain p-2"
            />
          ) : (
            <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-app-border text-gray-400">
              <FiMaximize size={30} />
              <span className="text-xs">Chưa có mã QR</span>
            </div>
          )}

          <p className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {book.bookCode}
          </p>

          {book.qrCode && (
            <button
              type="button"
              onClick={() =>
                downloadFile(book.qrCode as string, `qr-${book.bookCode}.png`)
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
            >
              <FiDownload size={16} /> Tải mã QR
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

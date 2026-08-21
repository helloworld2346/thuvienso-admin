import { useState } from "react";
import {
  FiX,
  FiEye,
  FiDownload,
  FiFile,
  FiArrowLeft,
  FiFileText,
} from "react-icons/fi";
import type { Book, FileResponse } from "@/features/books/books.types";
import { useFilesByDocument } from "@/features/books/hooks/useFiles";
import { useModalA11y } from "@/hooks/useModalA11y";

interface BookFilesModalProps {
  book: Book | null;
  onClose: () => void;
}

export function BookFilesModal({ book, onClose }: BookFilesModalProps) {
  const idDocument = book?.document?.idDocument;
  const { data, isLoading, isError } = useFilesByDocument(idDocument);
  const [viewing, setViewing] = useState<FileResponse | null>(null);

  const handleClose = () => {
    setViewing(null);
    onClose();
  };

  const panelRef = useModalA11y<HTMLDivElement>({
    open: !!book,
    onClose: handleClose,
  });

  if (!book) return null;

  const isPdf = (f: FileResponse) => f.typeFile === "PDF";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-files-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface-2 shadow-2xl  dark:ring-1 dark:ring-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-app-border bg-gradient-to-r from-primary/10 to-transparent px-6 py-4 ">
          <div className="flex min-w-0 items-center gap-3">
            {viewing && (
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Quay lại danh sách file"
              >
                <FiArrowLeft size={18} />
              </button>
            )}
            <div className="min-w-0">
              <h2
                id="book-files-title"
                className="truncate text-base font-bold text-gray-900 dark:text-gray-100"
              >
                {viewing ? viewing.fileName : book.title}
              </h2>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {viewing ? viewing.typeFile : "Danh sách tài liệu"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-white hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewing ? (
            isPdf(viewing) ? (
              <iframe
                src={viewing.partFile}
                title={viewing.fileName}
                className="h-[70vh] w-full rounded-lg border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-center">
                <FiFileText
                  size={40}
                  className="text-gray-300 dark:text-gray-600"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Không hỗ trợ xem trực tiếp định dạng {viewing.typeFile}.
                </p>
                <a
                  href={viewing.partFile}
                  download
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
                >
                  <FiDownload size={16} /> Tải xuống
                </a>
              </div>
            )
          ) : (
            <>
              {!idDocument && (
                <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  Sách này chưa gắn tài liệu.
                </p>
              )}
              {idDocument && isLoading && (
                <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  Đang tải...
                </p>
              )}
              {idDocument && isError && (
                <p className="py-10 text-center text-sm text-red-600 dark:text-red-400">
                  Không tải được danh sách file.
                </p>
              )}
              {idDocument &&
                !isLoading &&
                !isError &&
                (data?.length ?? 0) === 0 && (
                  <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Chưa có file.
                  </p>
                )}

              {idDocument &&
                !isLoading &&
                !isError &&
                (data?.length ?? 0) > 0 && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {data!.map((f) => (
                      <div
                        key={f.idFile}
                        className="flex gap-3 rounded-xl border border-app-border p-3 transition-all hover:border-primary/40 hover:shadow-sm  dark:hover:border-primary/40"
                      >
                        {f.thumbnail ? (
                          <img
                            src={f.thumbnail}
                            alt={f.fileName}
                            loading="lazy"
                            className="h-24 w-20 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="flex h-24 w-20 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FiFile size={24} />
                          </span>
                        )}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {f.fileName}
                          </p>
                          <span className="mt-0.5 inline-flex w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {f.typeFile}
                          </span>
                          <div className="mt-auto flex items-center gap-2 pt-3">
                            <button
                              type="button"
                              onClick={() => setViewing(f)}
                              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                            >
                              <FiEye size={14} /> Xem
                            </button>
                            <a
                              href={f.partFile}
                              download
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                              <FiDownload size={14} /> Tải
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

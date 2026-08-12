import { FiX, FiExternalLink, FiDownload, FiFile } from "react-icons/fi";
import type { Book } from "@/features/books/books.types";
import { useFilesByDocument } from "@/features/books/hooks/useFiles";

interface BookFilesModalProps {
  book: Book | null;
  onClose: () => void;
}

export function BookFilesModal({ book, onClose }: BookFilesModalProps) {
  const idDocument = book?.document?.idDocument;
  const { data, isLoading, isError } = useFilesByDocument(idDocument);

  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="truncate text-lg font-bold text-gray-900">
            File: {book.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        {!idDocument && (
          <p className="py-10 text-center text-sm text-gray-500">
            Sách này chưa gắn tài liệu.
          </p>
        )}
        {idDocument && isLoading && (
          <p className="py-10 text-center text-sm text-gray-500">Đang tải...</p>
        )}
        {idDocument && isError && (
          <p className="py-10 text-center text-sm text-red-600">
            Không tải được danh sách file.
          </p>
        )}
        {idDocument && !isLoading && !isError && (data?.length ?? 0) === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">
            Chưa có file.
          </p>
        )}

        {idDocument && !isLoading && !isError && (data?.length ?? 0) > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data!.map((f) => (
              <div
                key={f.idFile}
                className="flex gap-3 rounded-xl border border-gray-200 p-3"
              >
                {f.thumbnail ? (
                  <img
                    src={f.thumbnail}
                    alt={f.fileName}
                    loading="lazy"
                    className="h-20 w-16 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="flex h-20 w-16 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FiFile size={22} />
                  </span>
                )}
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {f.fileName}
                  </p>
                  <span className="mt-0.5 text-xs text-gray-500">
                    {f.typeFile}
                  </span>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <a
                      href={f.partFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <FiExternalLink size={14} /> Xem
                    </a>
                    <a
                      href={f.partFile}
                      download
                      className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:underline"
                    >
                      <FiDownload size={14} /> Tải
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

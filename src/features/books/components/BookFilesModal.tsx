import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiEye,
  FiDownload,
  FiFile,
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiArchive,
  FiFolder,
  FiUploadCloud,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import type { Book, FileResponse } from "@/features/books/books.types";
import { useFilesByDocument } from "@/features/books/hooks/useFiles";
import { useUploadBookAudio } from "@/features/books/hooks/useBooks";
import { useModalA11y } from "@/hooks/useModalA11y";
import { Button } from "@/components/ui/Button";

interface BookFilesModalProps {
  book: Book | null;
  onClose: () => void;
}
const FILE_META: Record<
  FileResponse["typeFile"],
  { icon: IconType; box: string }
> = {
  PDF: {
    icon: FiFileText,
    box: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
  DOCX: {
    icon: FiFileText,
    box: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  MP4: {
    icon: FiVideo,
    box: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  },
  MP3: {
    icon: FiMusic,
    box: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  PNG: {
    icon: FiImage,
    box: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  JPG: {
    icon: FiImage,
    box: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  ZIP: {
    icon: FiArchive,
    box: "bg-gray-100 text-gray-600 dark:bg-surface-3 dark:text-gray-300",
  },
};

const fileMeta = (t: FileResponse["typeFile"]) =>
  FILE_META[t] ?? {
    icon: FiFile,
    box: "bg-primary/10 text-primary dark:bg-primary/20",
  };

export function BookFilesModal({ book, onClose }: BookFilesModalProps) {
  const idDocument = book?.document?.idDocument;
  const { data, isLoading, isError } = useFilesByDocument(idDocument);
  const [viewing, setViewing] = useState<FileResponse | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const uploadAudio = useUploadBookAudio();

  const handleClose = () => {
    setViewing(null);
    onClose();
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = e.target.files?.[0];
    if (!audio || !book) return;
    uploadAudio.mutate({ id: book.idBook, audio });
    e.target.value = "";
  };

  const panelRef = useModalA11y<HTMLDivElement>({
    open: !!book,
    onClose: handleClose,
  });

  if (!book) return null;

  const isPdf = (f: FileResponse) => f.typeFile === "PDF";
  const isImage = (f: FileResponse) =>
    f.typeFile === "PNG" || f.typeFile === "JPG";
  const count = data?.length ?? 0;

  return createPortal(
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
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-surface-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="relative overflow-hidden bg-primary px-6 py-5 dark:bg-gradient-to-br dark:from-primary-800 dark:to-primary-900">
          <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 right-16 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

          <div className="relative z-10 flex shrink-0 items-center justify-between gap-2">
            {!viewing ? (
              <>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioChange}
                />
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  disabled={uploadAudio.isPending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25 disabled:opacity-60"
                >
                  <FiUploadCloud size={16} />
                  <span className="hidden sm:inline">
                    {uploadAudio.isPending ? "Đang tải..." : "Tải audio"}
                  </span>
                </button>
              </>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {viewing ? (
            isPdf(viewing) ? (
              <iframe
                src={viewing.partFile}
                title={viewing.fileName}
                className="h-[70vh] w-full rounded-xl border border-app-border"
              />
            ) : isImage(viewing) ? (
              <div className="flex justify-center">
                <img
                  src={viewing.partFile}
                  alt={viewing.fileName}
                  className="max-h-[70vh] rounded-xl border border-app-border object-contain"
                />
              </div>
            ) : (
              <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-center">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${fileMeta(viewing.typeFile).box}`}
                >
                  {(() => {
                    const Icon = fileMeta(viewing.typeFile).icon;
                    return <Icon size={30} />;
                  })()}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Không hỗ trợ xem trực tiếp định dạng {viewing.typeFile}.
                </p>
                <a
                  href={viewing.partFile}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
                >
                  <FiDownload size={16} /> Tải xuống
                </a>
              </div>
            )
          ) : (
            <>
              {!idDocument && (
                <EmptyState
                  icon={FiFolder}
                  text="Sách này chưa gắn tài liệu."
                />
              )}

              {idDocument && isLoading && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-28 animate-pulse rounded-2xl border border-app-border bg-surface-3"
                    />
                  ))}
                </div>
              )}

              {idDocument && isError && (
                <EmptyState
                  icon={FiFile}
                  text="Không tải được danh sách file."
                  danger
                />
              )}

              {idDocument && !isLoading && !isError && count === 0 && (
                <EmptyState icon={FiFile} text="Chưa có file nào." />
              )}

              {idDocument && !isLoading && !isError && count > 0 && (
                <>
                  <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {count} file
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {data!.map((f) => {
                      const meta = fileMeta(f.typeFile);
                      const Icon = meta.icon;
                      return (
                        <div
                          key={f.idFile}
                          className="group flex gap-3 rounded-2xl border border-app-border bg-surface p-3 transition-all hover:border-primary/40 hover:shadow-md"
                        >
                          {f.thumbnail ? (
                            <img
                              src={f.thumbnail}
                              alt={f.fileName}
                              loading="lazy"
                              className="h-24 w-20 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <span
                              className={`flex h-24 w-20 shrink-0 items-center justify-center rounded-xl ${meta.box}`}
                            >
                              <Icon size={26} />
                            </span>
                          )}
                          <div className="flex min-w-0 flex-1 flex-col">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {f.fileName}
                            </p>
                            <span
                              className={`mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.box}`}
                            >
                              <Icon size={11} /> {f.typeFile}
                            </span>
                            <div className="mt-auto flex items-center gap-2 pt-3">
                              <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<FiEye size={14} />}
                                onClick={() => setViewing(f)}
                                className="px-3 py-1.5 text-xs"
                              >
                                Xem
                              </Button>
                              <a
                                href={f.partFile}
                                download
                                className="inline-flex items-center gap-1 rounded-lg border border-app-border px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-surface-3 dark:text-gray-300"
                              >
                                <FiDownload size={14} /> Tải
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function EmptyState({
  icon: Icon,
  text,
  danger = false,
}: {
  icon: IconType;
  text: string;
  danger?: boolean;
}) {
  return (
    <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
          danger
            ? "bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-400"
            : "bg-surface-3 text-gray-400 dark:text-gray-500"
        }`}
      >
        <Icon size={28} />
      </span>
      <p
        className={`text-sm ${
          danger
            ? "text-red-600 dark:text-red-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

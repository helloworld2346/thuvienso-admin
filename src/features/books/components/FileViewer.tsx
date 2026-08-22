import type { IconType } from "react-icons";
import { FiFile, FiDownload } from "react-icons/fi";
import type { FileResponse } from "@/features/books/books.types";
import { fileMeta } from "@/features/books/components/fileMeta";
import { MediaPlayer } from "@/features/books/components/MediaPlayer";

interface FileViewerProps {
  file: FileResponse;
}

export function FileViewer({ file }: FileViewerProps) {
  if (file.typeFile === "PDF")
    return (
      <iframe
        src={file.partFile}
        title={file.fileName}
        className="h-[70vh] w-full rounded-2xl border border-app-border"
      />
    );

  if (file.typeFile === "PNG" || file.typeFile === "JPG")
    return (
      <div className="flex justify-center">
        <img
          src={file.partFile}
          alt={file.fileName}
          className="max-h-[70vh] rounded-2xl border border-app-border object-contain"
        />
      </div>
    );

  if (file.typeFile === "MP4")
    return (
      <MediaPlayer src={file.partFile} kind="video" title={file.fileName} />
    );

  if (file.typeFile === "MP3")
    return (
      <MediaPlayer src={file.partFile} kind="audio" title={file.fileName} />
    );

  const meta = fileMeta(file.typeFile);
  const Icon: IconType = meta.icon ?? FiFile;
  return (
    <div className="flex h-[40vh] flex-col items-center justify-center gap-3 text-center">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${meta.box}`}
      >
        <Icon size={30} />
      </span>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Không hỗ trợ xem trực tiếp định dạng {file.typeFile}.
      </p>
      <a
        href={file.partFile}
        download
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
      >
        <FiDownload size={16} /> Tải xuống
      </a>
    </div>
  );
}

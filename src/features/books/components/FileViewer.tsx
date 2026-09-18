import type { IconType } from "react-icons";
import { FiFile, FiDownload } from "react-icons/fi";
import { FileResponse } from "@/features/files/files.types";
import { fileMeta } from "@/features/books/components/fileMeta";
import { MediaPlayer } from "@/features/books/components/MediaPlayer";
import { filesApi } from "@/features/files/api/files.api";

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
    <div className="flex h-[40vh] flex-col items-center justify-center space-y-3 text-center">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${meta.box}`}
      >
        <Icon size={30} />
      </span>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Không hỗ trợ xem trực tiếp định dạng {file.typeFile}.
      </p>
      <button
        type="button"
        onClick={() => filesApi.download(file.idFile, file.fileName)}
        className="absolute right-2 top-2 ..."
        aria-label={`Tải ${file.fileName}`}
      >
        <FiDownload size={14} />
      </button>
    </div>
  );
}

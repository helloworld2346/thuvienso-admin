import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { FiFile, FiDownload, FiLoader } from "react-icons/fi";
import { FileResponse } from "@/features/files/files.types";
import { fileMeta } from "@/features/books/components/fileMeta";
import { MediaPlayer } from "@/features/books/components/MediaPlayer";
import { filesApi } from "@/features/files/api/files.api";

const PREVIEWABLE = ["PDF", "PNG", "JPG", "MP4", "MP3"];

interface FileViewerProps {
  file: FileResponse;
}

export function FileViewer({ file }: FileViewerProps) {
  const canPreview = PREVIEWABLE.includes(file.typeFile);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!canPreview) return;
    let objectUrl: string | null = null;
    let active = true;
    setUrl(null);
    setError(false);

    filesApi
      .view(file.idFile)
      .then((u) => {
        objectUrl = u;
        if (active) setUrl(u);
        else URL.revokeObjectURL(u);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.idFile, canPreview]);

  if (canPreview && error)
    return (
      <div className="flex h-[40vh] flex-col items-center justify-center space-y-3 text-center text-sm text-gray-500 dark:text-gray-400">
        Không tải được nội dung file.
      </div>
    );

  if (canPreview && !url)
    return (
      <div className="flex h-[40vh] items-center justify-center text-gray-400">
        <FiLoader size={28} className="animate-spin" />
      </div>
    );

  if (file.typeFile === "PDF")
    return (
      <iframe
        src={url!}
        title={file.fileName}
        className="h-[70vh] w-full rounded-2xl border border-app-border"
      />
    );

  if (file.typeFile === "PNG" || file.typeFile === "JPG")
    return (
      <div className="flex justify-center">
        <img
          src={url!}
          alt={file.fileName}
          className="max-h-[70vh] rounded-2xl border border-app-border object-contain"
        />
      </div>
    );

  if (file.typeFile === "MP4")
    return <MediaPlayer src={url!} kind="video" title={file.fileName} />;

  if (file.typeFile === "MP3")
    return <MediaPlayer src={url!} kind="audio" title={file.fileName} />;

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
        className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
        aria-label={`Tải ${file.fileName}`}
      >
        <FiDownload size={16} className="mr-1.5" /> Tải xuống
      </button>
    </div>
  );
}

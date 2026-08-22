import type { IconType } from "react-icons";
import {
  FiFile,
  FiFileText,
  FiImage,
  FiVideo,
  FiMusic,
  FiArchive,
} from "react-icons/fi";
import type { FileResponse } from "@/features/books/books.types";

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

export const fileMeta = (t: FileResponse["typeFile"]) =>
  FILE_META[t] ?? {
    icon: FiFile,
    box: "bg-primary/10 text-primary dark:bg-primary/20",
  };

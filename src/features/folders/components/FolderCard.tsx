import { FiFolder, FiMoreVertical } from "react-icons/fi";
import type { Folder } from "@/features/folders/folders.types";

interface Props {
  folder: Folder;
  selected: boolean;
  onOpen: (f: Folder) => void;
  onMenu: (e: React.MouseEvent, f: Folder) => void;
}

export function FolderCard({ folder, selected, onOpen, onMenu }: Props) {
  return (
    <div
      onDoubleClick={() => onOpen(folder)}
      onContextMenu={(e) => onMenu(e, folder)}
      className={`group relative flex flex-col gap-3 rounded-2xl border p-4 transition-all hover:border-primary/40 hover:shadow-lg ${
        selected
          ? "border-primary/60 bg-primary/5"
          : "border-app-border bg-surface"
      }`}
    >
      <div className="flex items-start justify-end">
        <button
          type="button"
          onClick={(e) => onMenu(e, folder)}
          className="rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:bg-surface-3 group-hover:opacity-100"
          aria-label="Tuỳ chọn"
        >
          <FiMoreVertical size={16} />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onOpen(folder)}
        className="flex flex-col items-start gap-2 text-left"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FiFolder size={24} />
        </span>
        <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
          {folder.folderName}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {folder.itemCount != null ? `${folder.itemCount} mục` : "—"}
        </span>
      </button>
    </div>
  );
}

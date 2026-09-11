import type { IconType } from "react-icons";
import { FiRotateCcw, FiXCircle } from "react-icons/fi";

interface DeletedRowProps {
  icon: IconType;
  name: string;
  onRestore: () => void;
  onHardDelete: () => void;
  restoring?: boolean;
}

export function DeletedRow({
  icon: Icon,
  name,
  onRestore,
  onHardDelete,
  restoring = false,
}: DeletedRowProps) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm transition-colors hover:border-app-border hover:bg-surface-3">
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-muted text-gray-400">
          <Icon size={13} />
        </span>
        <span className="truncate text-gray-700 dark:text-gray-300">
          {name}
        </span>
      </span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onRestore}
          disabled={restoring}
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-surface-muted hover:text-primary disabled:opacity-50"
          aria-label="Khôi phục"
          title="Khôi phục"
        >
          <FiRotateCcw size={14} />
        </button>
        <button
          type="button"
          onClick={onHardDelete}
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-surface-muted hover:text-red-500"
          aria-label="Xoá vĩnh viễn"
          title="Xoá vĩnh viễn"
        >
          <FiXCircle size={14} />
        </button>
      </div>
    </li>
  );
}

import { FiGrid, FiList, FiUploadCloud } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import type { Folder } from "@/features/folders/folders.types";
import type { ViewMode } from "@/features/folders/store/folders.store";

interface Props {
  trail: Folder[];
  viewMode: ViewMode;
  onSetView: (m: ViewMode) => void;
  onCrumb: (f: Folder | null) => void;
  onUpload: () => void;
}

export function FolderToolbar({
  trail,
  viewMode,
  onSetView,
  onCrumb,
  onUpload,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav className="flex items-center gap-1 text-sm" aria-label="Đường dẫn">
        <button
          type="button"
          onClick={() => onCrumb(null)}
          className="rounded px-2 py-1 text-gray-500 hover:bg-surface-3 hover:text-primary"
        >
          Thư mục gốc
        </button>
        {trail.map((f, i) => {
          const isLast = i === trail.length - 1;
          return (
            <span key={f.idFolder} className="flex items-center gap-1">
              <span className="text-gray-300">/</span>
              <button
                type="button"
                onClick={() => onCrumb(f)}
                className={`rounded px-2 py-1 hover:bg-surface-3 hover:text-primary ${
                  isLast
                    ? "font-semibold text-primary"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {f.folderName}
              </button>
            </span>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-app-border p-0.5">
          <button
            type="button"
            onClick={() => onSetView("grid")}
            className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-gray-500"}`}
            aria-label="Xem dạng lưới"
            aria-pressed={viewMode === "grid"}
          >
            <FiGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => onSetView("list")}
            className={`rounded-md p-1.5 ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-gray-500"}`}
            aria-label="Xem dạng danh sách"
            aria-pressed={viewMode === "list"}
          >
            <FiList size={16} />
          </button>
        </div>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<FiUploadCloud size={16} />}
          onClick={onUpload}
        >
          Tải lên
        </Button>
      </div>
    </div>
  );
}

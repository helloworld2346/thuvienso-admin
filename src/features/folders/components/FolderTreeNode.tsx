import { useState } from "react";
import {
  FiChevronRight,
  FiFolder,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { useFolderChildren } from "@/features/folders/hooks/useFolders";
import type { Folder } from "@/features/folders/folders.types";

interface FolderTreeNodeProps {
  folder: Folder;
  level: number;
  selectedId: string | null;
  onSelect: (f: Folder) => void;
  onAddChild: (parent: Folder) => void;
  onEdit: (f: Folder) => void;
  onDelete: (f: Folder) => void;
  onContextMenu: (e: React.MouseEvent, f: Folder) => void;
  onDropFolder: (dragged: Folder, target: Folder) => void;
}

export function FolderTreeNode({
  folder,
  level,
  selectedId,
  onSelect,
  onAddChild,
  onEdit,
  onDelete,
  onContextMenu,
  onDropFolder,
}: FolderTreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { data: children, isLoading } = useFolderChildren(
    folder.idFolder,
    expanded,
  );

  return (
    <div>
      <div
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData(
            "application/x-folder",
            JSON.stringify(folder),
          );
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("application/x-folder")) {
            e.preventDefault();
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          const raw = e.dataTransfer.getData("application/x-folder");
          if (!raw) return;
          const dragged = JSON.parse(raw) as Folder;
          if (dragged.idFolder !== folder.idFolder)
            onDropFolder(dragged, folder);
        }}
        onContextMenu={(e) => onContextMenu(e, folder)}
        className={`group flex items-center gap-1 rounded-lg py-1.5 pr-2 ${
          selectedId === folder.idFolder
            ? "bg-primary/10"
            : dragOver
              ? "bg-primary/20 ring-1 ring-primary"
              : "hover:bg-surface-3"
        }`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded p-1 text-gray-400 hover:text-gray-700"
          aria-label={expanded ? "Thu gọn" : "Mở rộng"}
        >
          <FiChevronRight
            size={14}
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={() => onSelect(folder)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm text-gray-800 dark:text-gray-200"
        >
          <FiFolder size={15} className="shrink-0 text-primary" />
          <span className="truncate">{folder.folderName}</span>
        </button>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onAddChild(folder)}
            className="rounded p-1.5 text-gray-500 hover:bg-surface-muted"
            aria-label="Thêm con"
          >
            <FiPlus size={14} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(folder)}
            className="rounded p-1.5 text-gray-500 hover:bg-surface-muted"
            aria-label="Sửa"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(folder)}
            className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Xoá"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div>
          {isLoading && (
            <p
              className="py-1 text-xs text-gray-400"
              style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
            >
              Đang tải...
            </p>
          )}
          {children?.map((child) => (
            <FolderTreeNode
              key={child.idFolder}
              folder={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onContextMenu={onContextMenu}
              onDropFolder={onDropFolder}
            />
          ))}
          {!isLoading && children?.length === 0 && (
            <p
              className="py-1 text-xs text-gray-400"
              style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
            >
              Trống
            </p>
          )}
        </div>
      )}
    </div>
  );
}

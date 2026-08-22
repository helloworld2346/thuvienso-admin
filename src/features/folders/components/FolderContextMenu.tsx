import { useEffect, useRef } from "react";

export interface ContextMenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface FolderContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function FolderContextMenu({
  x,
  y,
  items,
  onClose,
}: FolderContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      style={{ top: y, left: x }}
      className="fixed z-[60] min-w-[180px] overflow-hidden rounded-lg border border-app-border bg-surface-2 py-1 shadow-xl"
    >
      {items.map((it, i) => (
        <button
          key={i}
          type="button"
          role="menuitem"
          disabled={it.disabled}
          onClick={() => {
            it.onClick();
            onClose();
          }}
          className={`block w-full px-3 py-1.5 text-left text-sm disabled:opacity-40 ${
            it.danger
              ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              : "text-gray-700 hover:bg-surface-3 dark:text-gray-200"
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

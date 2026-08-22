import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

interface PageSizeSelectProps {
  value: number;
  options?: number[];
  onChange: (value: number) => void;
}

const MENU_MAX_H = 240;

export function PageSizeSelect({
  value,
  options = [5, 10, 15, 30, 50],
  onChange,
}: PageSizeSelectProps) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < MENU_MAX_H && spaceAbove > spaceBelow);
    }
    setOpen((v) => !v);
  };

  return (
    <div
      ref={rootRef}
      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
    >
      <span className="hidden sm:inline whitespace-nowrap">Hiển thị</span>
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Số mục mỗi trang"
          className="flex items-center gap-2 rounded-lg border border-app-border bg-surface-3 px-2.5 py-1.5 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-200"
        >
          <span>{value}</span>
          <FiChevronDown
            size={14}
            className={`shrink-0 text-gray-400 transition-transform dark:text-gray-500 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className={`absolute right-0 z-50 max-h-60 w-20 overflow-auto rounded-lg border border-app-border bg-surface-2 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 ${
              openUp ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {options.map((opt) => {
              const isSel = opt === value;
              return (
                <li
                  key={opt}
                  role="option"
                  aria-selected={isSel}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex cursor-pointer items-center justify-between px-3 py-1.5 text-sm transition-colors ${
                    isSel
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-gray-700 hover:bg-surface-3 dark:text-gray-200"
                  }`}
                >
                  <span>{opt}</span>
                  {isSel && (
                    <FiCheck size={14} className="shrink-0 text-primary" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <span className="hidden sm:inline">mục/trang</span>
    </div>
  );
}

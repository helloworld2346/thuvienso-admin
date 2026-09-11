import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  "aria-label"?: string;
}

const MENU_MAX_H = 224;

export function Select({
  value,
  options,
  onChange,
  placeholder = "-- Chọn --",
  disabled = false,
  invalid = false,
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < MENU_MAX_H && spaceAbove > spaceBelow);
    }
    setOpen(true);
  };

  const toggle = () => {
    if (open) {
      setOpen(false);
    } else {
      openMenu();
    }
  };

  const commit = (v: string) => {
    const opt = options.find((o) => o.value === v);
    if (opt?.disabled) return;
    onChange(v);
    setOpen(false);
  };

  const findEnabled = (from: number, dir: 1 | -1) => {
    let i = from;
    while (i >= 0 && i < options.length) {
      if (!options[i].disabled) return i;
      i += dir;
    }
    return -1;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setActive((i) => {
        const dir = e.key === "ArrowDown" ? 1 : -1;
        const next = findEnabled(i + dir, dir);
        return next === -1 ? i : next;
      });
    }
    if ((e.key === "Enter" || e.key === " ") && open && active >= 0) {
      e.preventDefault();
      commit(options[active].value);
    } else if (e.key === "Enter" && !open) {
      e.preventDefault();
      openMenu();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => !disabled && toggle()}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60 dark:bg-surface-3 dark:text-gray-100 ${
          invalid
            ? "border-red-500 dark:border-red-400"
            : "border-gray-300 dark:border-app-border"
        }`}
      >
        <span
          className={
            selected
              ? "truncate text-gray-900 dark:text-gray-100"
              : "truncate text-gray-400 dark:text-gray-500"
          }
        >
          {selected ? selected.label : placeholder}
        </span>
        <FiChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform dark:text-gray-500 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute z-50 max-h-56 w-full overflow-auto rounded-lg border border-app-border bg-surface-2 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 ${
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
              Không có mục
            </li>
          )}
          {options.map((opt, i) => {
            const isSel = opt.value === value;
            const isDisabled = !!opt.disabled;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSel}
                aria-disabled={isDisabled}
                onMouseEnter={() => !isDisabled && setActive(i)}
                onClick={() => commit(opt.value)}
                className={`flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${
                  isDisabled
                    ? "cursor-not-allowed font-semibold text-gray-400 dark:text-gray-500"
                    : i === active
                      ? "cursor-pointer bg-primary/10 text-primary dark:bg-primary/20"
                      : "cursor-pointer text-gray-700 dark:text-gray-200"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSel && !isDisabled && (
                  <FiCheck size={15} className="shrink-0 text-primary" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

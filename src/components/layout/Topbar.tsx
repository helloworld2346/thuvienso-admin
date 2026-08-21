import {
  FiMenu,
  FiBell,
  FiSearch,
  FiMessageSquare,
  FiChevronDown,
} from "react-icons/fi";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-app-border bg-surface/80 px-4 py-3 backdrop-blur-xl lg:px-6">
      {/* Hamburger (mobile) */}
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Mở menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-app-border bg-surface-2 text-gray-600 shadow-sm dark:text-gray-300 lg:hidden"
      >
        <FiMenu size={18} />
      </button>

      {/* Thanh tìm kiếm */}
      <div className="relative w-full max-w-md">
        <FiSearch
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          type="text"
          placeholder="Tìm kiếm…"
          aria-label="Tìm kiếm"
          className="h-10 w-full rounded-full border border-app-border bg-surface-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      {/* Cụm phải */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Tin nhắn"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-app-border bg-surface-2 text-gray-600 shadow-sm transition-colors hover:bg-surface-3 dark:text-gray-300"
        >
          <FiMessageSquare size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-surface" />
        </button>

        <button
          type="button"
          aria-label="Thông báo"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-app-border bg-surface-2 text-gray-600 shadow-sm transition-colors hover:bg-surface-3 dark:text-gray-300"
        >
          <FiBell size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface" />
        </button>

        {/* Avatar + tên + chevron */}
        <button
          type="button"
          aria-label="Tài khoản"
          className="ml-1 flex items-center gap-2 rounded-full border border-app-border bg-surface-2 py-1 pl-1 pr-3 shadow-sm transition-colors hover:bg-surface-3"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {(user?.userName ?? "A").charAt(0).toUpperCase()}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block max-w-[8rem] truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              {user?.userName ?? "Admin"}
            </span>
          </span>
          <FiChevronDown
            size={16}
            className="hidden text-gray-400 dark:text-gray-500 sm:block"
          />
        </button>
      </div>
    </header>
  );
}

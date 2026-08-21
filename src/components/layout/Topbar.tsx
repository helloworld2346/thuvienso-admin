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
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 px-4 py-3 backdrop-blur-xl dark:border-gray-800 bg-surface-2/80 lg:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Bật/tắt menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        <FiMenu size={18} />
      </button>

      <div className="relative w-full max-w-md">
        <FiSearch
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          type="text"
          placeholder="Tìm kiếm…"
          aria-label="Tìm kiếm"
          className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Tin nhắn"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <FiMessageSquare size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-gray-800" />
        </button>

        <button
          type="button"
          aria-label="Thông báo"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <FiBell size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
        </button>

        <button
          type="button"
          aria-label="Tài khoản"
          className="ml-1 flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
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

import { useEffect, useRef, useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useThemeStore } from "@/store/theme.store";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const initial = (user?.userName ?? "A").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-app-border bg-surface px-4 py-3 lg:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Bật/tắt menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-surface-3 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <FiMenu size={20} />
      </button>

      <div className="hidden md:block">
        <p className="text-xs text-gray-400 dark:text-gray-500">Xin chào</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {user?.userName ?? "Admin"}
        </p>
      </div>

      <div className="relative ml-auto hidden w-full max-w-xs sm:block">
        <FiSearch
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
        <input
          type="text"
          placeholder="Tìm kiếm…"
          aria-label="Tìm kiếm"
          className="h-10 w-full rounded-xl border border-app-border bg-surface-3 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary dark:text-gray-100 dark:placeholder-gray-500"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:ml-0">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Tài khoản"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-surface-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white">
              {initial}
            </span>
            <FiChevronDown
              size={16}
              className={`hidden text-gray-400 transition-transform dark:text-gray-500 sm:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-app-border bg-surface shadow-xl"
            >
              <div className="flex items-center gap-3 border-b border-app-border bg-surface-2 px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user?.userName ?? "Admin"}
                  </p>
                  {user?.role && (
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {user.role}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-1.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-3 dark:text-gray-200"
                >
                  <FiUser size={16} className="text-gray-400" />
                  Hồ sơ
                </button>

                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={isDark}
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-3 dark:text-gray-200"
                >
                  <span className="flex items-center gap-3">
                    {isDark ? (
                      <FiSun size={16} className="text-gray-400" />
                    ) : (
                      <FiMoon size={16} className="text-gray-400" />
                    )}
                    Chế độ tối
                  </span>
                  <span
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      isDark ? "bg-primary" : "bg-gray-300 dark:bg-surface-3"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        isDark ? "translate-x-[18px]" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    void logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <FiLogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

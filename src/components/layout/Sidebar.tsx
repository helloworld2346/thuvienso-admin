import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBookOpen,
  FiTag,
  FiRepeat,
  FiUsers,
  FiBarChart2,
  FiFileText,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface NavItem {
  to: string;
  label: string;
  icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Tổng quan", icon: FiGrid },
  { to: "/dashboard/library", label: "Thư viện", icon: FiBookOpen },
  { to: "/dashboard/categories", label: "Danh mục", icon: FiTag },
  { to: "/dashboard/borrow", label: "Mượn trả", icon: FiRepeat },
  { to: "/dashboard/accounts", label: "Tài khoản", icon: FiUsers },
  { to: "/dashboard/statistics", label: "Thống kê", icon: FiBarChart2 },
  { to: "/dashboard/audit-logs", label: "Nhật ký", icon: FiFileText },
];

interface SidebarProps {
  /** Trạng thái mở của drawer trên mobile */
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="text-base font-bold text-primary"
          >
            Thư Viện Số
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {(user?.userName ?? "A").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                {user?.userName ?? "Admin"}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.role ?? "Quản trị"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FiLogOut size={18} className="shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}

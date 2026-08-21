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
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
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
        className={`fixed inset-y-0 left-0 z-50 flex w-20 flex-col items-center bg-white py-5 transition-transform duration-300 dark:bg-gray-950 lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 lg:bg-transparent lg:py-2 lg:dark:bg-transparent ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavLink
          to="/dashboard"
          onClick={onClose}
          aria-label="Thư Viện Số"
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-black text-white shadow-lg shadow-primary/30"
        >
          f5
        </NavLink>

        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng menu"
          className="mt-3 flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
        >
          <FiX size={18} />
        </button>

        <div className="my-4 h-px w-8 bg-gray-200 dark:bg-gray-800" />

        <nav className="flex flex-1 flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={onClose}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) =>
                  `group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/40"
                      : "text-gray-400 hover:bg-gray-100 hover:text-primary dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute -left-2 h-6 w-1 rounded-full bg-primary" />
                    )}
                    <Icon size={20} className="shrink-0" />
                    <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={logout}
          title="Đăng xuất"
          aria-label="Đăng xuất"
          className="group relative mt-2 flex h-11 w-11 items-center justify-center rounded-2xl text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/15 dark:hover:text-red-400"
        >
          <FiLogOut size={20} className="shrink-0" />
          <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
            Đăng xuất
          </span>
        </button>
      </aside>
    </>
  );
}

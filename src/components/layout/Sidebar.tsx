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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-primary py-5 text-white transition-all duration-300 lg:relative lg:inset-auto lg:z-auto lg:min-h-[calc(100vh-2rem)] lg:translate-x-0 lg:rounded-[2rem] ${
          open
            ? "w-64 translate-x-0 px-4"
            : "w-20 -translate-x-full px-2 lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-1">
          <NavLink
            to="/dashboard"
            aria-label="Thư Viện Số"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-primary shadow-lg"
          >
            f5
          </NavLink>
          {open && (
            <span className="truncate text-base font-bold text-white">
              Thư Viện Số
            </span>
          )}
        </div>

        <div className="my-4 h-px w-full bg-white/20" />

        <nav className="flex flex-1 flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                title={item.label}
                aria-label={item.label}
                className={({ isActive }) =>
                  `group relative flex h-12 items-center gap-3 rounded-2xl transition-colors ${
                    open ? "px-3" : "justify-center px-0"
                  } ${
                    isActive
                      ? "bg-white font-semibold text-primary shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                {open ? (
                  <span className="truncate text-sm">{item.label}</span>
                ) : (
                  <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                    {item.label}
                  </span>
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
          className={`group relative mt-2 flex h-12 items-center gap-3 rounded-2xl text-white/80 transition-colors hover:bg-white/10 hover:text-white ${
            open ? "px-3" : "justify-center px-0"
          }`}
        >
          <FiLogOut size={20} className="shrink-0" />
          {open ? (
            <span className="truncate text-sm">Đăng xuất</span>
          ) : (
            <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-gray-700">
              Đăng xuất
            </span>
          )}
        </button>
      </aside>
    </>
  );
}

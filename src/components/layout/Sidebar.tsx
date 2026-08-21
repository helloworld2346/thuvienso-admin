import { useEffect, useState } from "react";
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
import logo from "@/assets/logos/logo.png";

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
  const [showTooltip, setShowTooltip] = useState(!open);

  useEffect(() => {
    if (open) {
      setShowTooltip(false);
      return;
    }
    const timer = window.setTimeout(() => setShowTooltip(true), 300);
    return () => window.clearTimeout(timer);
  }, [open]);

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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-primary via-primary to-primary-700 py-5 text-white shadow-2xl shadow-black/20 ring-1 ring-white/10 transition-all duration-300 lg:relative lg:inset-auto lg:z-auto lg:min-h-[calc(100vh-2rem)] lg:translate-x-0 lg:rounded-[2rem] ${
          open
            ? "w-64 translate-x-0 px-4"
            : "w-20 -translate-x-full px-2 lg:translate-x-0"
        }`}
      >
        <div className="sidebar-orb sidebar-orb-1" aria-hidden="true" />
        <div className="sidebar-orb sidebar-orb-2" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -left-10 h-44 w-44 rounded-full border border-white/10"
        />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-3 select-none text-[5rem] font-black leading-none text-white/[0.06]"
        >
          f5
        </p>

        <div
          className={`relative z-10 flex items-center gap-3 ${
            open ? "px-1" : "justify-center px-0"
          }`}
        >
          <NavLink
            to="/dashboard"
            aria-label="Thư Viện Số"
            className={`flex shrink-0 items-center justify-center overflow-hidden transition-all duration-300 ${
              open ? "h-20 w-20 p-1.5" : "h-14 w-14 p-1"
            }`}
          >
            <img
              src={logo}
              alt="Thư Viện Số Sư Đoàn 5"
              className="h-full w-full object-contain"
            />
          </NavLink>
          {open && (
            <div className="min-w-0">
              <span className="block truncate text-base font-bold leading-tight text-white">
                Thư Viện Số
              </span>
              <span className="block truncate text-[10px] uppercase tracking-[0.3em] text-white/50">
                Sư Đoàn 5
              </span>
            </div>
          )}
        </div>

        <div className="relative z-10 my-4 h-px w-full bg-white/20" />

        {open && (
          <p className="relative z-10 mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
            Menu
          </p>
        )}

        <nav className="relative z-10 flex flex-1 flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                aria-label={item.label}
                className={({ isActive }) =>
                  `group relative flex h-12 items-center gap-3 rounded-2xl transition-all duration-200 ${
                    open ? "px-3" : "justify-center px-0"
                  } ${
                    isActive
                      ? "sidebar-active bg-white/95 font-semibold text-primary shadow-lg shadow-black/20 ring-1 ring-white/40 backdrop-blur-sm"
                      : "font-medium text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Thanh chỉ báo active phát sáng bên trái */}
                    <span
                      className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Ô icon */}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-inherit group-hover:bg-white/10"
                      }`}
                    >
                      <Icon size={19} />
                    </span>

                    {open ? (
                      <span className="truncate text-sm">{item.label}</span>
                    ) : (
                      showTooltip && (
                        <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity lg:block lg:group-hover:opacity-100 dark:bg-gray-700">
                          {item.label}
                        </span>
                      )
                    )}

                    {/* Chấm chỉ báo phải khi mở rộng */}
                    {open && isActive && (
                      <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(0,122,63,0.6)]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="relative z-10 my-3 h-px w-full bg-white/20" />

        {/* Đăng xuất */}
        <button
          type="button"
          onClick={logout}
          aria-label="Đăng xuất"
          className={`group relative z-10 flex h-12 items-center gap-3 rounded-2xl font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white ${
            open ? "px-3" : "justify-center px-0"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-white/10">
            <FiLogOut size={19} />
          </span>
          {open ? (
            <span className="truncate text-sm">Đăng xuất</span>
          ) : (
            showTooltip && (
              <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity lg:block lg:group-hover:opacity-100 dark:bg-gray-700">
                Đăng xuất
              </span>
            )
          )}
        </button>
      </aside>
    </>
  );
}

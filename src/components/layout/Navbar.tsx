import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiSettings, FiBell, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Tổng quan" },
  { to: "/dashboard/library", label: "Thư viện" },
  { to: "/dashboard/categories", label: "Danh mục" },
  { to: "/dashboard/borrow", label: "Mượn trả" },
  { to: "/dashboard/accounts", label: "Tài khoản" },
  { to: "/dashboard/statistics", label: "Thống kê" },
  { to: "/dashboard/audit-logs", label: "Nhật ký" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 bg-gray-50/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
        <NavLink
          to="/dashboard"
          className="flex items-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-base font-bold text-primary shadow-sm"
        >
          Thư Viện Số
        </NavLink>

        <nav className="hidden items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-100 lg:inline-flex"
          >
            <FiSettings size={16} />
            <span>Cài đặt</span>
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100"
            aria-label="Thông báo"
          >
            <FiBell size={18} />
          </button>

          <button
            type="button"
            onClick={logout}
            title={user?.userName ?? "Admin"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-hover"
            aria-label="Tài khoản"
          >
            <FiUser size={18} />
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm lg:hidden"
            aria-label="Menu"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-4 mb-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:hidden">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

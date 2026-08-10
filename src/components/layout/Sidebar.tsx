import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBook,
  FiTag,
  FiUsers,
  FiFileText,
  FiRepeat,
  FiBarChart2,
  FiX,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useSidebarStore } from "@/store/sidebar.store";

interface NavItem {
  to: string;
  label: string;
  icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Tổng quan", icon: FiGrid },
  { to: "/dashboard/books", label: "Sách", icon: FiBook },
  { to: "/dashboard/categories", label: "Danh mục", icon: FiTag },
  { to: "/dashboard/users", label: "Người dùng", icon: FiUsers },
  { to: "/dashboard/news", label: "Tin tức", icon: FiFileText },
  { to: "/dashboard/borrow", label: "Mượn trả", icon: FiRepeat },
  { to: "/dashboard/statistics", label: "Thống kê", icon: FiBarChart2 },
];

export function Sidebar() {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const close = useSidebarStore((s) => s.close);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <span className="text-base font-bold text-primary">Thư Viện Số</span>
          <button
            type="button"
            onClick={close}
            className="text-gray-500 hover:text-gray-800 lg:hidden"
            aria-label="Đóng menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/dashboard"}
                    onClick={close}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

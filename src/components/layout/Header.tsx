import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggle = useSidebarStore((s) => s.toggle);

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:px-6">
      <button
        type="button"
        onClick={toggle}
        className="text-gray-600 hover:text-gray-900 lg:hidden"
        aria-label="Mở menu"
      >
        <FiMenu size={22} />
      </button>

      <div className="ml-auto flex items-center gap-4">
        <div className="text-right leading-tight">
          <p className="text-sm font-semibold text-gray-900">
            {user?.userName ?? "Admin"}
          </p>
          <p className="text-xs text-gray-500">{user?.role ?? ""}</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <FiLogOut size={16} />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}

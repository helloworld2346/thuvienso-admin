import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <span className="font-bold text-primary">Thư Viện Số — Admin</span>
        <button onClick={logout} className="text-primary hover:underline">
          Đăng xuất
        </button>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

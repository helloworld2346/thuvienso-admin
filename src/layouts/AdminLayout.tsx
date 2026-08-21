import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-app lg:gap-2 lg:p-4">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-surface shadow-2xl lg:min-h-[calc(100vh-2rem)] lg:rounded-[2rem]">
        <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />{" "}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

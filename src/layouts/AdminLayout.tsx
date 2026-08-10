import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
}

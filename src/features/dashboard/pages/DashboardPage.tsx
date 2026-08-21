import {
  FiFileText,
} from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  useOverviewStats,
  useDocumentByType,
} from "@/features/dashboard/hooks/useDashboardStats";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { DocumentTypeChart } from "@/features/dashboard/components/DocumentTypeChart";

export default function DashboardPage() {
  const userName = useAuthStore((s) => s.user?.userName);
  const overview = useOverviewStats();
  const byType = useDocumentByType();

  return (  
    <div className="space-y-6">  
      <div className="flex items-center justify-between">  
        <div>  
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">  
            Admin System  
          </p>  
          <h1 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">  
            Xin chào, {userName ?? "Admin"}  
          </h1>  
        </div>  
      </div>  
  
      {overview.isError ? (  
        <p className="text-sm text-red-600 dark:text-red-400">  
          Không tải được số liệu tổng quan.  
        </p>  
      ) : (  
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">  
          <StatCard icon={FiFileText} label="Tài liệu" value={overview.data?.totalDocuments ?? 0} loading={overview.isLoading} accent="primary" />  
        </div>  
      )}  
  
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">  
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">  
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">  
            Xem nhiều nhất  
          </h2>  
        </section>  
  
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">  
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">  
            Tài liệu theo loại  
          </h2>  
          {byType.isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Đang tải…
            </p>
          ) : byType.isError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Không tải được dữ liệu.
            </p>
          ) : !byType.data || byType.data.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chưa có dữ liệu.
            </p>
          ) : (
            <DocumentTypeChart data={byType.data} />
          )}
        </section>
      </div>
    </div>
  );
}

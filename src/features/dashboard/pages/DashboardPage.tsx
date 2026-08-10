import { FiFileText, FiBook, FiUsers, FiRepeat } from "react-icons/fi";  
import { useAuthStore } from "@/features/auth/store/auth.store";  
import {  
  useOverviewStats,  
  useDocumentByType,  
  useTopViewed,  
} from "@/features/dashboard/hooks/useDashboardStats";  
import { StatCard } from "@/features/dashboard/components/StatCard";  
import { DocumentTypeChart } from "@/features/dashboard/components/DocumentTypeChart";  
import { TopViewedList } from "@/features/dashboard/components/TopViewedList";  
  
export default function DashboardPage() {  
  const userName = useAuthStore((s) => s.user?.userName);  
  
  const overview = useOverviewStats();  
  const byType = useDocumentByType();  
  const topViewed = useTopViewed();  
  
  return (  
    <div className="space-y-8">  
      <div>  
        <h1 className="text-2xl font-bold text-gray-900">  
          Xin chào, {userName ?? "Admin"}  
        </h1>  
        <p className="mt-1 text-sm text-gray-500">  
          Tổng quan hệ thống Thư Viện Số Sư Đoàn 5.  
        </p>  
      </div>  
  
      {/* Stat cards */}  
      {overview.isError ? (  
        <p className="text-sm text-red-600">Không tải được số liệu tổng quan.</p>  
      ) : (  
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">  
          <StatCard  
            icon={FiFileText}  
            label="Tài liệu"  
            value={overview.data?.totalDocuments ?? 0}  
            loading={overview.isLoading}  
          />  
          <StatCard  
            icon={FiBook}  
            label="Sách"  
            value={overview.data?.totalBooks ?? 0}  
            loading={overview.isLoading}  
          />  
          <StatCard  
            icon={FiUsers}  
            label="Người dùng"  
            value={overview.data?.totalAccounts ?? 0}  
            loading={overview.isLoading}  
          />  
          <StatCard  
            icon={FiRepeat}  
            label="Lượt mượn"  
            value={overview.data?.totalBorrows ?? 0}  
            loading={overview.isLoading}  
          />  
        </div>  
      )}  
  
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">  
        {/* Document by type */}  
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">  
          <h2 className="mb-4 text-lg font-bold text-gray-900">  
            Tài liệu theo loại  
          </h2>  
          {byType.isLoading ? (  
            <p className="text-sm text-gray-500">Đang tải…</p>  
          ) : byType.isError ? (  
            <p className="text-sm text-red-600">Không tải được dữ liệu.</p>  
          ) : !byType.data || byType.data.length === 0 ? (  
            <p className="text-sm text-gray-500">Chưa có dữ liệu.</p>  
          ) : (  
            <DocumentTypeChart data={byType.data} />  
          )}  
        </section>  
  
        {/* Top viewed */}  
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">  
          <h2 className="mb-4 text-lg font-bold text-gray-900">  
            Xem nhiều nhất  
          </h2>  
          {topViewed.isLoading ? (  
            <p className="text-sm text-gray-500">Đang tải…</p>  
          ) : topViewed.isError ? (  
            <p className="text-sm text-red-600">Không tải được dữ liệu.</p>  
          ) : !topViewed.data || topViewed.data.length === 0 ? (  
            <p className="text-sm text-gray-500">Chưa có dữ liệu.</p>  
          ) : (  
            <TopViewedList data={topViewed.data} />  
          )}  
        </section>  
      </div>  
    </div>  
  );  
}
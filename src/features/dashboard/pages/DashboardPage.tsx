import { FiFileText, FiBook, FiUsers, FiRepeat } from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  useOverviewStats,
  useDocumentByType,
  useTopViewed,
  useMonthlyTrend,
} from "@/features/dashboard/hooks/useDashboardStats";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { DocumentTypeChart } from "@/features/dashboard/components/DocumentTypeChart";
import { TopViewedChart } from "@/features/dashboard/components/TopViewedChart";
import { MonthlyTrendChart } from "@/features/dashboard/components/MonthlyTrendChart";

function ChartState<T>({
  query,
  children,
}: {
  query: { isLoading: boolean; isError: boolean; data?: T[] };
  children: (data: T[]) => React.ReactNode;
}) {
  if (query.isLoading)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải…</p>
    );
  if (query.isError)
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Không tải được dữ liệu.
      </p>
    );
  if (!query.data || query.data.length === 0)
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Chưa có dữ liệu.
      </p>
    );
  return <>{children(query.data)}</>;
}

export default function DashboardPage() {
  const userName = useAuthStore((s) => s.user?.userName);
  const overview = useOverviewStats();
  const byType = useDocumentByType();
  const topViewed = useTopViewed();
  const trend = useMonthlyTrend();

  const viewsSeries = trend.data?.map((p) => p.views);
  const borrowsSeries = trend.data?.map((p) => p.borrows);

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
          <StatCard
            icon={FiFileText}
            label="Tài liệu"
            value={overview.data?.totalDocuments ?? 0}
            loading={overview.isLoading}
            accent="primary"
            delta={8}
            series={viewsSeries}
          />
          <StatCard
            icon={FiBook}
            label="Sách"
            value={overview.data?.totalBooks ?? 0}
            loading={overview.isLoading}
            accent="emerald"
            delta={5}
            series={viewsSeries}
          />
          <StatCard
            icon={FiUsers}
            label="Tài khoản"
            value={overview.data?.totalAccounts ?? 0}
            loading={overview.isLoading}
            accent="teal"
            delta={12}
            series={borrowsSeries}
          />
          <StatCard
            icon={FiRepeat}
            label="Lượt mượn"
            value={overview.data?.totalBorrows ?? 0}
            loading={overview.isLoading}
            accent="lime"
            delta={-3}
            series={borrowsSeries}
          />
        </div>
      )}

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
          Xu hướng hoạt động theo tháng
        </h2>
        <ChartState query={trend}>
          {(data) => <MonthlyTrendChart data={data} />}
        </ChartState>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
            Xem nhiều nhất
          </h2>
          <ChartState query={topViewed}>
            {(data) => <TopViewedChart data={data} />}
          </ChartState>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
            Tài liệu theo loại
          </h2>
          <ChartState query={byType}>
            {(data) => <DocumentTypeChart data={data} />}
          </ChartState>
        </section>
      </div>
    </div>
  );
}

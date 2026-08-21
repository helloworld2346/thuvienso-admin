import { FiEye, FiDownload, FiRepeat } from "react-icons/fi";
import {
  useMonthlyTrend,
  useDocumentByStatus,
  useTopCategories,
  useDocumentByType,
  useTopViewed,
  useUsersByRole,
  useWeeklyActivity,
} from "@/features/dashboard/hooks/useDashboardStats";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { MonthlyTrendChart } from "@/features/dashboard/components/MonthlyTrendChart";
import { StatusChart } from "@/features/dashboard/components/StatusChart";
import { TopCategoriesChart } from "@/features/dashboard/components/TopCategoriesChart";
import { DocumentTypeChart } from "@/features/dashboard/components/DocumentTypeChart";
import { TopViewedChart } from "@/features/dashboard/components/TopViewedChart";
import { UsersByRoleChart } from "@/features/dashboard/components/UsersByRoleChart";
import { WeeklyActivityChart } from "@/features/dashboard/components/WeeklyActivityChart";
import { MonthlyDetailTable } from "@/features/dashboard/components/MonthlyDetailTable";

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

function Panel({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className ?? ""}`}
    >
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StatisticsPage() {
  const trend = useMonthlyTrend();
  const byStatus = useDocumentByStatus();
  const topCategories = useTopCategories();
  const byType = useDocumentByType();
  const topViewed = useTopViewed();
  const usersByRole = useUsersByRole();
  const weekly = useWeeklyActivity();

  const totalViews = trend.data?.reduce((s, p) => s + p.views, 0) ?? 0;
  const totalDownloads = trend.data?.reduce((s, p) => s + p.downloads, 0) ?? 0;
  const totalBorrows = trend.data?.reduce((s, p) => s + p.borrows, 0) ?? 0;

  const viewsSeries = trend.data?.map((p) => p.views);
  const downloadsSeries = trend.data?.map((p) => p.downloads);
  const borrowsSeries = trend.data?.map((p) => p.borrows);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
          Báo cáo
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
          Thống kê
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={FiEye}
          label="Tổng lượt xem"
          value={totalViews}
          loading={trend.isLoading}
          accent="primary"
          series={viewsSeries}
        />
        <StatCard
          icon={FiDownload}
          label="Tổng lượt tải"
          value={totalDownloads}
          loading={trend.isLoading}
          accent="teal"
          series={downloadsSeries}
        />
        <StatCard
          icon={FiRepeat}
          label="Tổng lượt mượn"
          value={totalBorrows}
          loading={trend.isLoading}
          accent="lime"
          series={borrowsSeries}
        />
      </div>

      <Panel title="Xu hướng hoạt động theo tháng">
        <ChartState query={trend}>
          {(data) => <MonthlyTrendChart data={data} />}
        </ChartState>
      </Panel>

      <Panel title="Hoạt động theo ngày trong tuần">
        <ChartState query={weekly}>
          {(data) => <WeeklyActivityChart data={data} />}
        </ChartState>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Tài liệu theo trạng thái">
          <ChartState query={byStatus}>
            {(data) => <StatusChart data={data} />}
          </ChartState>
        </Panel>

        <Panel title="Phân bố theo danh mục">
          <ChartState query={topCategories}>
            {(data) => <TopCategoriesChart data={data} />}
          </ChartState>
        </Panel>

        <Panel title="Tài liệu theo loại">
          <ChartState query={byType}>
            {(data) => <DocumentTypeChart data={data} />}
          </ChartState>
        </Panel>

        <Panel title="Xem nhiều nhất">
          <ChartState query={topViewed}>
            {(data) => <TopViewedChart data={data} />}
          </ChartState>
        </Panel>

        <Panel title="Tài khoản theo vai trò">
          <ChartState query={usersByRole}>
            {(data) => <UsersByRoleChart data={data} />}
          </ChartState>
        </Panel>
      </div>

      <Panel title="Chi tiết theo tháng">
        <ChartState query={trend}>
          {(data) => <MonthlyDetailTable data={data} />}
        </ChartState>
      </Panel>
    </div>
  );
}

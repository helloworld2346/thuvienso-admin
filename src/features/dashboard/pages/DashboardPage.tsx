import {
  FiFileText,
  FiBook,
  FiUsers,
  FiRepeat,
  FiEye,
  FiDownload,
} from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  useOverviewStats,
  useDocumentByType,
  useTopViewed,
  useMonthlyTrend,
  useWeeklyActivity,
  useUsersByRole,
} from "@/features/dashboard/hooks/useDashboardStats";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { DocumentTypeChart } from "@/features/dashboard/components/DocumentTypeChart";
import { TopViewedChart } from "@/features/dashboard/components/TopViewedChart";
import { WeeklyActivityChart } from "@/features/dashboard/components/WeeklyActivityChart";
import { UsersByRoleChart } from "@/features/dashboard/components/UsersByRoleChart";
import { MonthlyDetailTable } from "@/features/dashboard/components/MonthlyDetailTable";
import { PageHeader } from "@/components/ui/PageHeader";

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
      className={`rounded-2xl border border-app-border bg-surface-2 p-6 shadow-sm   ${className ?? ""}`}
    >
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DashboardPage() {
  const userName = useAuthStore((s) => s.user?.userName);
  const overview = useOverviewStats();
  const byType = useDocumentByType();
  const topViewed = useTopViewed();
  const trend = useMonthlyTrend();
  const weekly = useWeeklyActivity();
  const usersByRole = useUsersByRole();

  const viewsSeries = trend.data?.map((p) => p.views);
  const downloadsSeries = trend.data?.map((p) => p.downloads);
  const borrowsSeries = trend.data?.map((p) => p.borrows);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Xin chào, ${userName ?? "Admin"}`}
        subtitle="Admin System"
      />

      {overview.isError ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          Không tải được số liệu tổng quan.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          <StatCard
            icon={FiFileText}
            label="Tài liệu"
            value={overview.data?.totalDocuments ?? 0}
            loading={overview.isLoading}
            accent="primary"
          />
          <StatCard
            icon={FiBook}
            label="Sách"
            value={overview.data?.totalBooks ?? 0}
            loading={overview.isLoading}
            accent="blue"
          />
          <StatCard
            icon={FiUsers}
            label="Tài khoản"
            value={overview.data?.totalAccounts ?? 0}
            loading={overview.isLoading}
            accent="violet"
          />
          <StatCard
            icon={FiEye}
            label="Lượt xem"
            value={overview.data?.totalViews ?? 0}
            loading={overview.isLoading}
            accent="amber"
            series={viewsSeries}
          />
          <StatCard
            icon={FiDownload}
            label="Lượt tải"
            value={overview.data?.totalDownloads ?? 0}
            loading={overview.isLoading}
            accent="cyan"
            series={downloadsSeries}
          />
          <StatCard
            icon={FiRepeat}
            label="Lượt mượn"
            value={overview.data?.totalBorrows ?? 0}
            loading={overview.isLoading}
            accent="rose"
            series={borrowsSeries}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Xem nhiều nhất" className="lg:col-span-2">
          <ChartState query={topViewed}>
            {(data) => <TopViewedChart data={data} />}
          </ChartState>
        </Panel>

        <Panel title="Tài liệu theo loại">
          <ChartState query={byType}>
            {(data) => <DocumentTypeChart data={data} />}
          </ChartState>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Tài khoản theo vai trò">
          <ChartState query={usersByRole}>
            {(data) => <UsersByRoleChart data={data} />}
          </ChartState>
        </Panel>
        <Panel title="Hoạt động theo ngày trong tuần">
          <ChartState query={weekly}>
            {(data) => <WeeklyActivityChart data={data} />}
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

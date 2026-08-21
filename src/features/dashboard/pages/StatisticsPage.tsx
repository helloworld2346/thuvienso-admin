import {
  useMonthlyTrend,
  useDocumentByStatus,
  useTopCategories,
  useDocumentByType,
  useTopViewed,
} from "@/features/dashboard/hooks/useDashboardStats";
import { MonthlyTrendChart } from "@/features/dashboard/components/MonthlyTrendChart";
import { StatusChart } from "@/features/dashboard/components/StatusChart";
import { TopCategoriesChart } from "@/features/dashboard/components/TopCategoriesChart";
import { DocumentTypeChart } from "@/features/dashboard/components/DocumentTypeChart";
import { TopViewedChart } from "@/features/dashboard/components/TopViewedChart";

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

      <Panel title="Xu hướng hoạt động theo tháng">
        <ChartState query={trend}>
          {(data) => <MonthlyTrendChart data={data} />}
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
      </div>
    </div>
  );
}

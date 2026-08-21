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
} from "@/features/dashboard/hooks/useDashboardStats";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { DocumentTypeChart } from "@/features/dashboard/components/DocumentTypeChart";
import { TopViewedChart } from "@/features/dashboard/components/TopViewedChart";

export default function DashboardPage() {
  const userName = useAuthStore((s) => s.user?.userName);
  const overview = useOverviewStats();
  const byType = useDocumentByType();
  const topViewed = useTopViewed();

  const cards = [
    {
      icon: FiFileText,
      label: "Tài liệu",
      value: overview.data?.totalDocuments,
      accent: "primary" as const,
    },
    {
      icon: FiBook,
      label: "Sách",
      value: overview.data?.totalBooks,
      accent: "emerald" as const,
    },
    {
      icon: FiUsers,
      label: "Người dùng",
      value: overview.data?.totalAccounts,
      accent: "teal" as const,
    },
    {
      icon: FiRepeat,
      label: "Lượt mượn",
      value: overview.data?.totalBorrows,
      accent: "green" as const,
    },
    {
      icon: FiEye,
      label: "Lượt xem",
      value: overview.data?.totalViews,
      accent: "lime" as const,
    },
    {
      icon: FiDownload,
      label: "Lượt tải",
      value: overview.data?.totalDownloads,
      accent: "primary" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero giữ tone xanh chủ đạo */}
      <section className="relative overflow-hidden rounded-3xl bg-primary p-8 shadow-sm sm:p-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-white/10" />
        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-6 select-none text-[7rem] font-black leading-none text-white/[0.06]"
        >
          f5
        </p>
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Admin System
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Xin chào, {userName ?? "Admin"}
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
            Tổng quan hệ thống Thư Viện Số Sư Đoàn 5.
          </p>
          <div className="mt-5 h-1 w-16 rounded-full bg-white/80" />
        </div>
      </section>

      {/* Hàng KPI */}
      {overview.isError ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          Không tải được số liệu tổng quan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((c) => (
            <StatCard
              key={c.label}
              icon={c.icon}
              label={c.label}
              value={c.value ?? 0}
              loading={overview.isLoading}
              accent={c.accent}
            />
          ))}
        </div>
      )}

      {/* Khu chart: top xem (rộng) + donut theo loại */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
            Xem nhiều nhất
          </h2>
          {topViewed.isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Đang tải…
            </p>
          ) : topViewed.isError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Không tải được dữ liệu.
            </p>
          ) : !topViewed.data || topViewed.data.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chưa có dữ liệu.
            </p>
          ) : (
            <TopViewedChart data={topViewed.data} />
          )}
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

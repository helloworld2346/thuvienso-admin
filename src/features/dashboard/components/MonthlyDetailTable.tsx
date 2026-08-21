import { FiEye, FiDownload, FiRepeat } from "react-icons/fi";
import type { MonthlyPoint } from "@/features/dashboard/dashboard.types";

interface MonthlyDetailTableProps {
  data: MonthlyPoint[];
}

const fmt = (n: number) => n.toLocaleString("vi-VN");

const METRICS = [
  {
    key: "views" as const,
    label: "Lượt xem",
    icon: FiEye,
    bar: "bg-primary",
    text: "text-primary",
  },
  {
    key: "downloads" as const,
    label: "Lượt tải",
    icon: FiDownload,
    bar: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "borrows" as const,
    label: "Lượt mượn",
    icon: FiRepeat,
    bar: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
];

export function MonthlyDetailTable({ data }: MonthlyDetailTableProps) {
  const total = data.reduce(
    (acc, p) => ({
      views: acc.views + p.views,
      downloads: acc.downloads + p.downloads,
      borrows: acc.borrows + p.borrows,
    }),
    { views: 0, downloads: 0, borrows: 0 },
  );

  const max = {
    views: Math.max(...data.map((p) => p.views), 1),
    downloads: Math.max(...data.map((p) => p.downloads), 1),
    borrows: Math.max(...data.map((p) => p.borrows), 1),
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-app-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-surface-2 to-surface-3 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Tháng
              </th>
              {METRICS.map((m) => {
                const Icon = m.icon;
                return (
                  <th
                    key={m.key}
                    scope="col"
                    className="px-4 py-3.5 text-right font-semibold"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Icon size={13} className={m.text} />
                      {m.label}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((p, idx) => (
              <tr
                key={p.month}
                className={`border-t border-app-border text-gray-700 transition-colors hover:bg-surface-app/60 dark:text-gray-300 ${
                  idx % 2 === 1 ? "bg-surface-app/40" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {p.month}
                </td>
                {METRICS.map((m) => {
                  const value = p[m.key];
                  const isPeak = value === max[m.key];
                  return (
                    <td key={m.key} className="px-4 py-3">
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`tabular-nums ${
                            isPeak
                              ? `font-bold ${m.text}`
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {fmt(value)}
                        </span>
                        <span className="h-1 w-full max-w-[72px] overflow-hidden rounded-full bg-surface-3">
                          <span
                            className={`block h-full rounded-full ${m.bar}`}
                            style={{ width: `${(value / max[m.key]) * 100}%` }}
                          />
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-app-border bg-surface-3 font-bold text-gray-900 dark:text-gray-100">
              <td className="px-4 py-3.5">Tổng</td>
              {METRICS.map((m) => (
                <td key={m.key} className="px-4 py-3.5 text-right tabular-nums">
                  {fmt(total[m.key])}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

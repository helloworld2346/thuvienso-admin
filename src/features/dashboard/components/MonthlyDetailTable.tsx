import type { MonthlyPoint } from "@/features/dashboard/dashboard.types";

interface MonthlyDetailTableProps {
  data: MonthlyPoint[];
}

const fmt = (n: number) => n.toLocaleString("vi-VN");

export function MonthlyDetailTable({ data }: MonthlyDetailTableProps) {
  const total = data.reduce(
    (acc, p) => ({
      views: acc.views + p.views,
      downloads: acc.downloads + p.downloads,
      borrows: acc.borrows + p.borrows,
    }),
    { views: 0, downloads: 0, borrows: 0 },
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th scope="col" className="px-4 py-3 font-semibold">
              Tháng
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Lượt xem
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Lượt tải
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Lượt mượn
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr
              key={p.month}
              className="border-b border-gray-100 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {p.month}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {fmt(p.views)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {fmt(p.downloads)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {fmt(p.borrows)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200 font-bold text-gray-900 dark:border-gray-700 dark:text-gray-100">
            <td className="px-4 py-3">Tổng</td>
            <td className="px-4 py-3 text-right tabular-nums">
              {fmt(total.views)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {fmt(total.downloads)}
            </td>
            <td className="px-4 py-3 text-right tabular-nums">
              {fmt(total.borrows)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

import type { CountByKey } from "@/features/dashboard/dashboard.types";

interface MonthlyDetailTableProps {
  data: CountByKey[];
}

const fmt = (n: number) => n.toLocaleString("vi-VN");

export function MonthlyDetailTable({ data }: MonthlyDetailTableProps) {
  const total = data.reduce((acc, p) => acc + p.value, 0);
  const max = Math.max(...data.map((p) => p.value), 1);

  return (
    <div className="overflow-hidden rounded-2xl border border-app-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-surface-2 to-surface-3 text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th scope="col" className="px-4 py-3.5 font-semibold">
                Tháng
              </th>
              <th scope="col" className="px-4 py-3.5 text-right font-semibold">
                Số liệu
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, idx) => {
              const isPeak = p.value === max;
              return (
                <tr
                  key={p.key}
                  className={`border-t border-app-border text-gray-700 transition-colors hover:bg-surface-app/60 dark:text-gray-300 ${
                    idx % 2 === 1 ? "bg-surface-app/40" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {p.key}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={`tabular-nums ${
                          isPeak
                            ? "font-bold text-primary"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {fmt(p.value)}
                      </span>
                      <span className="h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-surface-3">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: `${(p.value / max) * 100}%` }}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-app-border bg-surface-3 font-bold text-gray-900 dark:text-gray-100">
              <td className="px-4 py-3.5">Tổng</td>
              <td className="px-4 py-3.5 text-right tabular-nums">
                {fmt(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

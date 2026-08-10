import type { CountByKey } from "@/features/dashboard/dashboard.types";

interface DocumentTypeChartProps {
  data: CountByKey[];
}

export function DocumentTypeChart({ data }: DocumentTypeChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-700">{item.key}</span>
            <span className="font-semibold text-gray-900">{item.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

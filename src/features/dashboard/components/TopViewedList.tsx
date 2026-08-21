import type { CountByKey } from "@/features/dashboard/dashboard.types";

interface TopViewedListProps {
  data: CountByKey[];
}

export function TopViewedList({ data }: TopViewedListProps) {
  return (
    <ol className="space-y-3">
      {data.map((item, index) => (
        <li key={item.key} className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary/20">
            {index + 1}
          </span>
          <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
            {item.key}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {item.count}
          </span>
        </li>
      ))}
    </ol>
  );
}

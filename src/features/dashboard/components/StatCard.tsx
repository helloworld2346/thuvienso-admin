import type { IconType } from "react-icons";

type Accent = "primary" | "blue" | "amber" | "violet" | "rose" | "cyan";

interface StatCardProps {
  icon: IconType;
  label: string;
  value: number | string;
  loading?: boolean;
  accent?: Accent;
}

const ACCENT: Record<Accent, string> = {
  primary: "bg-primary/10 text-primary dark:bg-primary/20",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  violet:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
  cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  accent = "primary",
}: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ACCENT[accent]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {loading ? (
          <div className="mt-1 h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

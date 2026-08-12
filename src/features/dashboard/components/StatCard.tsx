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
  primary: "bg-primary/10 text-primary",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
  cyan: "bg-cyan-50 text-cyan-600",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  accent = "primary",
}: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ACCENT[accent]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        {loading ? (
          <div className="mt-1 h-6 w-16 animate-pulse rounded bg-gray-200" />
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}

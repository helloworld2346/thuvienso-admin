import type { IconType } from "react-icons";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Accent =
  | "primary"
  | "emerald"
  | "teal"
  | "lime"
  | "green"
  | "blue"
  | "violet"
  | "amber"
  | "rose"
  | "cyan";

interface StatCardProps {
  icon: IconType;
  label: string;
  value: number | string;
  loading?: boolean;
  accent?: Accent;
  delta?: number;
  series?: number[];
}

const ACCENT: Record<Accent, { box: string; stroke: string }> = {
  primary: {
    box: "bg-primary/10 text-primary dark:bg-primary/20",
    stroke: "#007A3F",
  },
  emerald: {
    box: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    stroke: "#059669",
  },
  teal: {
    box: "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
    stroke: "#0d9488",
  },
  lime: {
    box: "bg-lime-50 text-lime-600 dark:bg-lime-500/15 dark:text-lime-400",
    stroke: "#65a30d",
  },
  green: {
    box: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
    stroke: "#16a34a",
  },
  blue: {
    box: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    stroke: "#2563eb",
  },
  violet: {
    box: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    stroke: "#8b5cf6",
  },
  amber: {
    box: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    stroke: "#f59e0b",
  },
  rose: {
    box: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    stroke: "#ec4899",
  },
  cyan: {
    box: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    stroke: "#06b6d4",
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  accent = "primary",
  delta,
  series,
}: StatCardProps) {
  const cfg = ACCENT[accent];
  const up = (delta ?? 0) >= 0;
  const sparkData = series?.map((v, i) => ({ i, v }));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-app-border bg-surface-2 p-5 shadow-sm transition-shadow hover:shadow-md  ">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cfg.box}`}
        >
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          {loading ? (
            <div className="mt-1 h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-surface-3" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          )}
        </div>

        {delta !== undefined && !loading && (
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              up
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
            }`}
          >
            {up ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>

      {sparkData && sparkData.length > 1 && (
        <div className="h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient
                  id={`spark-${accent}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={cfg.stroke} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={cfg.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={cfg.stroke}
                strokeWidth={2}
                fill={`url(#spark-${accent})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

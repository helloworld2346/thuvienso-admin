import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CountByKey } from "@/features/dashboard/dashboard.types";
import { useChartTheme } from "./chartTheme";
import { CHART_COLORS } from "@/utils/colors";

interface MonthlyTrendChartProps {
  data: CountByKey[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const t = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="trend-value" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_COLORS.primary}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS.primary}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={t.grid} />
          <XAxis
            dataKey="key"
            tick={{ fill: t.axis, fontSize: 12 }}
            axisLine={{ stroke: t.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: t.axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: t.tooltipBg,
              border: `1px solid ${t.tooltipBorder}`,
              borderRadius: 12,
              color: t.tooltipText,
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            name="Hoạt động"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            fill="url(#trend-value)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

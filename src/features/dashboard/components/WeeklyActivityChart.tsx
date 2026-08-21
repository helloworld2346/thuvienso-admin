import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CountByKey } from "@/features/dashboard/dashboard.types";
import { MULTI_PALETTE, useChartTheme } from "./chartTheme";

interface WeeklyActivityChartProps {
  data: CountByKey[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const t = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -8, right: 8, top: 8 }}>
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
            cursor={{ fill: t.grid, opacity: 0.3 }}
            contentStyle={{
              backgroundColor: t.tooltipBg,
              border: `1px solid ${t.tooltipBorder}`,
              borderRadius: 12,
              color: t.tooltipText,
              fontSize: 13,
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={MULTI_PALETTE[i % MULTI_PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

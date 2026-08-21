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
import { GREEN_PALETTE, useChartTheme } from "./chartTheme";

interface TopViewedChartProps {
  data: CountByKey[];
}

export function TopViewedChart({ data }: TopViewedChartProps) {
  const t = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 12, right: 16 }}
        >
          <CartesianGrid horizontal={false} stroke={t.grid} />
          <XAxis
            type="number"
            tick={{ fill: t.axis, fontSize: 12 }}
            axisLine={{ stroke: t.grid }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="key"
            width={120}
            tick={{ fill: t.axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
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
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((_, i) => (
              <Cell key={i} fill={GREEN_PALETTE[i % GREEN_PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

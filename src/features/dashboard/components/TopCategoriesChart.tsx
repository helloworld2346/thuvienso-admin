import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CountByKey } from "@/features/dashboard/dashboard.types";
import { useChartTheme } from "./chartTheme";

interface TopCategoriesChartProps {
  data: CountByKey[];
}

export function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  const t = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={t.grid} />
          <PolarAngleAxis dataKey="key" tick={{ fill: t.axis, fontSize: 12 }} />
          <Radar
            name="Số tài liệu"
            dataKey="count"
            stroke="#007A3F"
            fill="#007A3F"
            fillOpacity={0.35}
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
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

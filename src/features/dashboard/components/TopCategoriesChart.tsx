import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CountByKey } from "@/features/dashboard/dashboard.types";
import { MULTI_PALETTE, useChartTheme } from "./chartTheme";

interface TopCategoriesChartProps {
  data: CountByKey[];
}

interface DotProps {
  cx?: number;
  cy?: number;
  index?: number;
}

function ColorDot({ cx, cy, index = 0 }: DotProps) {
  if (cx == null || cy == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={MULTI_PALETTE[index % MULTI_PALETTE.length]}
      stroke="#fff"
      strokeWidth={1.5}
    />
  );
}

export function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  const t = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <defs>
            <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#007A3F" stopOpacity={0.5} />
              <stop offset="50%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <PolarGrid stroke={t.grid} />
          <PolarAngleAxis dataKey="key" tick={{ fill: t.axis, fontSize: 12 }} />
          <Radar
            name="Số tài liệu"
            dataKey="count"
            stroke="#007A3F"
            strokeWidth={2}
            fill="url(#radar-fill)"
            fillOpacity={1}
            dot={<ColorDot />}
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

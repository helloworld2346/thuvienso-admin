import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CountByKey } from "@/features/dashboard/dashboard.types";
import { GREEN_PALETTE, useChartTheme } from "./chartTheme";

interface DocumentTypeChartProps {
  data: CountByKey[];
}

export function DocumentTypeChart({ data }: DocumentTypeChartProps) {
  const t = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="key"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={GREEN_PALETTE[i % GREEN_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: t.tooltipBg,
              border: `1px solid ${t.tooltipBorder}`,
              borderRadius: 12,
              color: t.tooltipText,
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 13, color: t.axis }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

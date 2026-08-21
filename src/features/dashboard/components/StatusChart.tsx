import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { CountByKey } from "@/features/dashboard/dashboard.types";
import { useChartTheme } from "./chartTheme";

interface StatusChartProps {
  data: CountByKey[];
}

const STATUS_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

export function StatusChart({ data }: StatusChartProps) {
  const t = useChartTheme();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="key"
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={95}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
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
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: t.axis }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

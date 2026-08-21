import { useThemeStore } from "@/store/theme.store";

export const GREEN_PALETTE = [
  "#007A3F",
  "#2a9d63",
  "#57b482",
  "#8ecdaa",
  "#006e39",
  "#00351c",
];

export const MULTI_PALETTE = [
  "#007A3F", // primary green
  "#2563eb", // blue
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // rose
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#ef4444", // red
  "#f97316", // orange
  "#14b8a6", // teal
  "#a855f7", // purple
  "#84cc16", // lime
];

export const STATUS_PALETTE = ["#10b981", "#f59e0b", "#ef4444"];

export function useChartTheme() {
  const isDark = useThemeStore((s) => s.theme) === "dark";
  return {
    isDark,
    grid: isDark ? "#123322" : "#e5e7eb",
    axis: isDark ? "#8ea89a" : "#6b7280",
    tooltipBg: isDark ? "#0a1f14" : "#ffffff",
    tooltipBorder: isDark ? "#1c4230" : "#e5e7eb",
    tooltipText: isDark ? "#e6f4ec" : "#111827",
  };
}

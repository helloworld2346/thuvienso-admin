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
];

export function useChartTheme() {
  const isDark = useThemeStore((s) => s.theme) === "dark";
  return {
    isDark,
    grid: isDark ? "#1f2937" : "#e5e7eb",
    axis: isDark ? "#9ca3af" : "#6b7280",
    tooltipBg: isDark ? "#111827" : "#ffffff",
    tooltipBorder: isDark ? "#374151" : "#e5e7eb",
    tooltipText: isDark ? "#e5e7eb" : "#111827",
  };
}

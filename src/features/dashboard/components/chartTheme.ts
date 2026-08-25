import { useThemeStore } from "@/store/theme.store";

export {
  GREEN_PALETTE,
  MULTI_PALETTE,
  STATUS_PALETTE,
  CHART_COLORS,
} from "@/utils/colors";

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

export const PRIMARY = {
  DEFAULT: "#007A3F",
  hover: "#006633",
  50: "#e6f4ec",
  100: "#c2e4d1",
  200: "#8ecdaa",
  300: "#57b482",
  400: "#2a9d63",
  500: "#007A3F",
  600: "#006e39",
  700: "#005c30",
  800: "#004a27",
  900: "#00351c",
} as const;

export const BRAND = {
  primary: PRIMARY.DEFAULT,
  primaryHover: PRIMARY.hover,
} as const;

export const CHART_COLORS = {
  primary: PRIMARY.DEFAULT,
  emerald: "#059669",
  teal: "#0d9488",
  lime: "#65a30d",
  green: "#16a34a",
  blue: "#2563eb",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#ec4899",
  cyan: "#06b6d4",
} as const;

export const GREEN_PALETTE = [
  PRIMARY.DEFAULT,
  "#2a9d63",
  "#57b482",
  "#8ecdaa",
  "#006e39",
  "#00351c",
];

export const MULTI_PALETTE = [
  PRIMARY.DEFAULT,
  "#2563eb",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#ef4444",
  "#f97316",
  "#14b8a6",
  "#a855f7",
  "#84cc16",
];

export const STATUS_PALETTE = ["#10b981", "#f59e0b", "#ef4444"];

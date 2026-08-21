import { FiMoon, FiSun } from "react-icons/fi";
import { useThemeStore } from "@/store/theme.store";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={isDark ? "Chế độ sáng" : "Chế độ tối"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-app-border bg-surface-3 text-gray-600 shadow-sm transition-colors hover:bg-surface-muted dark:text-gray-300"
    >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}

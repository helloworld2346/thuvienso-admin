interface PageSizeSelectProps {
  value: number;
  options?: number[];
  onChange: (value: number) => void;
}

export function PageSizeSelect({
  value,
  options = [5, 10, 15, 20],
  onChange,
}: PageSizeSelectProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <span className="hidden sm:inline">Hiển thị</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Số mục mỗi trang"
        className="rounded-lg border border-app-border-strong bg-surface-3 px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-gray-200"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="hidden sm:inline">mục/trang</span>
    </label>
  );
}

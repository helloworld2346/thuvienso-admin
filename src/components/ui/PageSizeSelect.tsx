import { Select } from "@/components/ui/Select";

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
      <div className="w-20">
        <Select
          value={String(value)}
          onChange={(v) => onChange(Number(v))}
          options={options.map((opt) => ({
            value: String(opt),
            label: String(opt),
          }))}
          aria-label="Số mục mỗi trang"
        />
      </div>
      <span className="hidden sm:inline">mục/trang</span>
    </label>
  );
}

interface StatBarProps {
  label: string;
  percent: number;
}

export function StatBar({ label, percent }: StatBarProps) {
  return (
    <div className="min-w-[120px] flex-1">
      <p className="mb-2 text-sm font-medium text-gray-600">{label}</p>
      <div className="flex items-center gap-2">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {percent}%
        </span>
      </div>
    </div>
  );
}

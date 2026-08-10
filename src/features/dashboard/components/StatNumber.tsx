import type { IconType } from "react-icons";

interface StatNumberProps {
  icon: IconType;
  value: string;
  label: string;
}

export function StatNumber({ icon: Icon, value, label }: StatNumberProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-4xl font-bold leading-none text-gray-900">{value}</p>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

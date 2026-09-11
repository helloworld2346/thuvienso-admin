import type { IconType } from "react-icons";
import { FiFolder, FiFile, FiHardDrive, FiTrash2 } from "react-icons/fi";
import { formatSize } from "@/features/folders/folders.format";

interface FolderStatsProps {
  folderCount: number;
  fileCount: number;
  totalSize: number;
  trashCount: number;
}

interface StatItem {
  icon: IconType;
  label: string;
  value: string | number;
  tint: string;
}

export function FolderStats({
  folderCount,
  fileCount,
  totalSize,
  trashCount,
}: FolderStatsProps) {
  const items: StatItem[] = [
    {
      icon: FiFolder,
      label: "Thư mục",
      value: folderCount,
      tint: "text-primary",
    },
    {
      icon: FiFile,
      label: "Tệp tin",
      value: fileCount,
      tint: "text-blue-500",
    },
    {
      icon: FiHardDrive,
      label: "Dung lượng",
      value: formatSize(totalSize),
      tint: "text-violet-500",
    },
    {
      icon: FiTrash2,
      label: "Thùng rác",
      value: trashCount,
      tint: "text-rose-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 divide-app-border overflow-hidden rounded-xl border border-app-border bg-surface sm:grid-cols-4 sm:divide-x">
      {items.map(({ icon: Icon, label, value, tint }) => (
        <div key={label} className="flex items-center gap-3 px-4 py-3">
          <Icon size={18} className={`shrink-0 ${tint}`} />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {value}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

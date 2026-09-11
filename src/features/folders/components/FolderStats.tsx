import { FiFolder, FiFile, FiHardDrive, FiTrash2 } from "react-icons/fi";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { formatSize } from "@/features/folders/folders.format";

interface FolderStatsProps {
  folderCount: number;
  fileCount: number;
  totalSize: number;
  trashCount: number;
}

export function FolderStats({
  folderCount,
  fileCount,
  totalSize,
  trashCount,
}: FolderStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard
        icon={FiFolder}
        label="Thư mục"
        value={folderCount}
        accent="primary"
      />
      <StatCard icon={FiFile} label="Tệp tin" value={fileCount} accent="blue" />
      <StatCard
        icon={FiHardDrive}
        label="Dung lượng"
        value={formatSize(totalSize)}
        accent="violet"
      />
      <StatCard
        icon={FiTrash2}
        label="Thùng rác"
        value={trashCount}
        accent="rose"
      />
    </div>
  );
}

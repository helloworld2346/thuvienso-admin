export interface FolderStyle {
  box: string;
  ring: string;
}

const FOLDER_PALETTE: FolderStyle[] = [
  {
    box: "bg-primary/10 text-primary dark:bg-primary/20",
    ring: "hover:border-primary/40",
  },
  {
    box: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    ring: "hover:border-blue-400/50",
  },
  {
    box: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    ring: "hover:border-amber-400/50",
  },
  {
    box: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    ring: "hover:border-violet-400/50",
  },
  {
    box: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    ring: "hover:border-rose-400/50",
  },
  {
    box: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    ring: "hover:border-cyan-400/50",
  },
  {
    box: "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
    ring: "hover:border-teal-400/50",
  },
  {
    box: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    ring: "hover:border-orange-400/50",
  },
];

// Hash ổn định từ id → luôn cùng màu cho cùng một folder
export function folderStyle(id: string): FolderStyle {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return FOLDER_PALETTE[hash % FOLDER_PALETTE.length];
}

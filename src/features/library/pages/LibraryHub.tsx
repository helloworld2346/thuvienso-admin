import { Link } from "react-router-dom";
import {
  FiFileText,
  FiBook,
  FiLayers,
  FiFolder,
  FiArrowRight,
} from "react-icons/fi";
import type { IconType } from "react-icons";

interface HubItem {
  to: string;
  label: string;
  description: string;
  icon: IconType;
  accent: string;
}

const ITEMS: HubItem[] = [
  {
    to: "/dashboard/library/documents",
    label: "Tài liệu",
    description: "Quản lý tài liệu số, file PDF, video, hình ảnh.",
    icon: FiFileText,
    accent: "bg-primary/10 text-primary dark:bg-primary/20",
  },
  {
    to: "/dashboard/library/books",
    label: "Sách",
    description: "Quản lý đầu sách, mã sách, số lượng và vị trí kệ.",
    icon: FiBook,
    accent: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    to: "/dashboard/library/collections",
    label: "Bộ sưu tập",
    description: "Nhóm tài liệu, sách theo chủ đề, chuyên mục.",
    icon: FiLayers,
    accent:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  },
  {
    to: "/dashboard/library/folders",
    label: "Thư mục",
    description: "Sắp xếp tài liệu theo cây thư mục lưu trữ.",
    icon: FiFolder,
    accent:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
];

export default function LibraryHub() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-8 shadow-sm sm:p-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Library
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Thư viện
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
            Chọn khu vực bạn muốn quản lý: tài liệu, sách, bộ sưu tập hoặc thư
            mục.
          </p>
          <div className="mt-5 h-1 w-16 rounded-full bg-white/80" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ITEMS.map(({ to, label, description, icon: Icon, accent }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}
            >
              <Icon size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {label}
                </h2>
                <FiArrowRight
                  className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-primary dark:text-gray-500"
                  size={18}
                />
              </div>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

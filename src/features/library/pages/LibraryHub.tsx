import { Link } from "react-router-dom";
import {
  FiFileText,
  FiBook,
  FiLayers,
  FiFolder,
  FiArrowRight,
  FiClock,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useDocuments } from "@/features/documents/hooks/useDocuments";
import { useBooks } from "@/features/books/hooks/useBooks";
import { useCollections } from "@/features/collections/hooks/useCollections";
import { useRootFolders } from "@/features/folders/hooks/useFolders";
import { DOCUMENT_TYPE_LABELS } from "@/features/documents/documents.types";

interface HubItem {
  to: string;
  label: string;
  description: string;
  icon: IconType;
  accent: string;
  bar: string;
  count?: number;
  loading: boolean;
}

interface RecentItem {
  key: string;
  to: string;
  title: string;
  subtitle: string;
  icon: IconType;
  accent: string;
  thumbnail?: string;
}

export default function LibraryHub() {
  const documents = useDocuments();
  const books = useBooks();
  const collections = useCollections();
  const folders = useRootFolders();

  const items: HubItem[] = [
    {
      to: "/dashboard/library/documents",
      label: "Tài liệu",
      description: "Quản lý tài liệu số, file PDF, video, hình ảnh.",
      icon: FiFileText,
      accent: "bg-primary/10 text-primary dark:bg-primary/20",
      bar: "bg-primary",
      count: documents.data?.length,
      loading: documents.isLoading,
    },
    {
      to: "/dashboard/library/books",
      label: "Sách",
      description: "Quản lý đầu sách, mã sách, số lượng và vị trí kệ.",
      icon: FiBook,
      accent: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      bar: "bg-blue-500",
      count: books.data?.length,
      loading: books.isLoading,
    },
    {
      to: "/dashboard/library/collections",
      label: "Bộ sưu tập",
      description: "Nhóm tài liệu, sách theo chủ đề, chuyên mục.",
      icon: FiLayers,
      accent:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
      bar: "bg-violet-500",
      count: collections.data?.length,
      loading: collections.isLoading,
    },
    {
      to: "/dashboard/library/folders",
      label: "Thư mục",
      description: "Sắp xếp tài liệu theo cây thư mục lưu trữ.",
      icon: FiFolder,
      accent:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
      bar: "bg-amber-500",
      count: folders.data?.length,
      loading: folders.isLoading,
    },
  ];

  const recentDocs: RecentItem[] = (documents.data ?? [])
    .slice(-4)
    .reverse()
    .map((d) => ({
      key: `doc-${d.idDocument}`,
      to: "/dashboard/library/documents",
      title: d.title,
      subtitle: DOCUMENT_TYPE_LABELS[d.typeDocument] ?? "Tài liệu",
      icon: FiFileText,
      accent: "bg-primary/10 text-primary dark:bg-primary/20",
      thumbnail: d.thumbnail || undefined,
    }));

  const recentBooks: RecentItem[] = (books.data ?? [])
    .slice(-4)
    .reverse()
    .map((b) => ({
      key: `book-${b.idBook}`,
      to: "/dashboard/library/books",
      title: b.title,
      subtitle: b.author,
      icon: FiBook,
      accent: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      thumbnail: b.thumbnail || undefined,
    }));

  const recent = [...recentDocs, ...recentBooks].slice(0, 6);
  const recentLoading = documents.isLoading || books.isLoading;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-8 shadow-sm dark:bg-gradient-to-br dark:from-primary-800 dark:to-primary-900 sm:p-10">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10">
          <FiBook size={180} className="text-white" />
        </div>
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map(
          ({
            to,
            label,
            description,
            icon: Icon,
            accent,
            bar,
            count,
            loading,
          }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-2xl border border-app-border bg-surface-2 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <span
                className={`absolute inset-y-0 left-0 w-1 origin-top scale-y-0 rounded-r-full transition-transform duration-300 group-hover:scale-y-100 ${bar}`}
              />
              <span
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20 ${bar}`}
              />

              <div className="relative z-10 flex items-start space-x-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${accent}`}
                >
                  <Icon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-baseline space-x-2">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {label}
                      </h2>
                      {loading ? (
                        <span className="h-5 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-surface-3" />
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-surface-3 dark:text-gray-300">
                          {count ?? 0}
                        </span>
                      )}
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white dark:bg-surface-3">
                      <FiArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>

      <section className="rounded-2xl border border-app-border bg-surface-2 p-6 shadow-sm">
        <div className="mb-4 flex items-center space-x-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
            <FiClock size={18} />
          </span>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Truy cập gần đây
          </h2>
        </div>

        {recentLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-surface-3"
              />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Chưa có mục nào.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map(
              ({ key, to, title, subtitle, icon: Icon, accent, thumbnail }) => (
                <Link
                  key={key}
                  to={to}
                  className="group flex items-center space-x-3 rounded-xl border border-app-border bg-surface p-3 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:hover:border-primary/40 dark:hover:bg-primary/10"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={title}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent}`}
                    >
                      <Icon size={18} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {title}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {subtitle}
                    </p>
                  </div>
                  <FiArrowRight
                    size={16}
                    className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </Link>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}

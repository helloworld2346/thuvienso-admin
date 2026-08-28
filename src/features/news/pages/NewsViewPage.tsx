import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit2,
  FiEye,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import { useNewsById } from "@/features/news/hooks/useNews";
import { DOCUMENT_STATUS_LABELS } from "@/features/documents/documents.types";
import { StateView } from "@/components/ui/StateView";
import { Button } from "@/components/ui/Button";

const STATUS_STYLES: Record<string, string> = {
  Pending:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  Approve:
    "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Refuse: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

export default function NewsViewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: news, isLoading, isError } = useNewsById(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/news")}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-surface-3 hover:text-primary dark:text-gray-400"
            aria-label="Quay lại"
          >
            <FiArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <FiFileText size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Xem tin tức
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Chi tiết nội dung tin tức
              </p>
            </div>
          </div>
        </div>
        {news && (
          <Button
            leftIcon={<FiEdit2 size={16} />}
            onClick={() => navigate(`/dashboard/news/${news.idNews}/edit`)}
          >
            Sửa
          </Button>
        )}
      </div>

      <StateView
        isLoading={isLoading}
        isError={isError}
        errorText="Không tải được tin tức."
      >
        {news && (
          <article className="mx-auto max-w-3xl rounded-2xl border border-app-border bg-surface p-8">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary dark:bg-primary/20">
                {news.categoryEntity?.categoryName ?? "Chưa phân loại"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${
                  STATUS_STYLES[news.status] ?? STATUS_STYLES.Pending
                }`}
              >
                {DOCUMENT_STATUS_LABELS[news.status] ?? news.status}
              </span>
              {news.publishedAt && (
                <span className="inline-flex items-center gap-1">
                  <FiCalendar size={12} />
                  {new Date(news.publishedAt).toLocaleString("vi-VN")}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <FiEye size={12} /> {news.viewCount ?? 0}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {news.title}
            </h2>

            {news.summary && (
              <p className="mt-3 text-base italic text-gray-600 dark:text-gray-300">
                {news.summary}
              </p>
            )}

            <div
              className="prose prose-sm mt-6 max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </article>
        )}
      </StateView>
    </div>
  );
}

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX, FiFileText } from "react-icons/fi";
import type { News } from "@/features/news/news.types";
import {
  DOCUMENT_STATUSES,
  DOCUMENT_STATUS_LABELS,
} from "@/features/documents/documents.types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useModalA11y } from "@/hooks/useModalA11y";
import { Select } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { slugify } from "@/utils/slugify";

const schema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  content: z.string().min(1, "Vui lòng nhập nội dung"),
  summary: z.string().optional(),
  slug: z.string().optional(),
  publishedAt: z.string().optional(),
  status: z.enum(DOCUMENT_STATUSES),
  categoryEntity: z.string().min(1, "Vui lòng chọn danh mục"),
});

type NewsFormValues = z.infer<typeof schema>;

interface NewsFormModalProps {
  open: boolean;
  editing: News | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: NewsFormValues) => void;
}

const emptyValues: NewsFormValues = {
  title: "",
  content: "",
  summary: "",
  slug: "",
  publishedAt: "",
  status: "Pending",
  categoryEntity: "",
};

const STATUS_OPTIONS = DOCUMENT_STATUSES.map((s) => ({
  value: s,
  label: DOCUMENT_STATUS_LABELS[s],
}));

export function NewsFormModal({
  open,
  editing,
  submitting,
  onClose,
  onSubmit,
}: NewsFormModalProps) {
  const panelRef = useModalA11y<HTMLDivElement>({
    open,
    onClose,
    locked: submitting,
  });

  const { data: categories, isLoading: loadingCategories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });
    
    const title = watch("title");

    useEffect(() => {
      setValue("slug", slugify(title ?? ""), { shouldValidate: true });
    }, [title, setValue]);

  useEffect(() => {
    if (!open) return;
    reset(
      editing
        ? {
            title: editing.title,
            content: editing.content,
            summary: editing.summary ?? "",
            slug: editing.slug ?? "",
            publishedAt: editing.publishedAt
              ? editing.publishedAt.slice(0, 16)
              : "",
            status: editing.status,
            categoryEntity: editing.categoryEntity?.idCategory ?? "",
          }
        : emptyValues,
    );
  }, [open, editing, reset]);

  if (!open) return null;

  const field =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500";
  const err = "mt-1 min-h-[1rem] text-xs text-red-600 dark:text-red-400";
  const labelCls =
    "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={() => !submitting && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-form-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="flex items-center justify-between bg-primary px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <FiFileText size={22} />
            </span>
            <div>
              <h2 id="news-form-title" className="text-lg font-bold">
                {editing ? "Sửa tin tức" : "Thêm tin tức"}
              </h2>
              <p className="text-sm text-white/75">
                {editing ? "Cập nhật thông tin tin tức" : "Thêm tin tức mới"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          id="news-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className={labelCls}>Tiêu đề</label>
            <input
              {...register("title")}
              autoFocus
              className={field}
              placeholder="Nhập tiêu đề tin tức"
            />
            <p className={err}>{errors.title?.message ?? ""}</p>
          </div>

          <div>
            <label className={labelCls}>Trạng thái</label>
            <Controller
              name="status"
              control={control}
              render={({ field: f }) => (
                <Select
                  value={f.value}
                  onChange={f.onChange}
                  options={STATUS_OPTIONS}
                  aria-label="Chọn trạng thái"
                />
              )}
            />
            <p className={err}>{errors.status?.message ?? ""}</p>
          </div>

          <div>
            <label className={labelCls}>Danh mục</label>
            <Controller
              name="categoryEntity"
              control={control}
              render={({ field: f }) => (
                <Select
                  value={f.value ?? ""}
                  onChange={f.onChange}
                  disabled={loadingCategories}
                  invalid={!!errors.categoryEntity}
                  placeholder={
                    loadingCategories ? "Đang tải..." : "-- Chọn danh mục --"
                  }
                  options={(categories ?? []).map((c) => ({
                    value: c.idCategory,
                    label: c.categoryName,
                  }))}
                  aria-label="Chọn danh mục"
                />
              )}
            />
            <p className={err}>{errors.categoryEntity?.message ?? ""}</p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Mô tả ngắn</label>
            <textarea
              {...register("summary")}
              rows={2}
              className={field}
              placeholder="Tóm tắt ngắn hiển thị ở danh sách tin"
            />
            <p className={err}>{errors.summary?.message ?? ""}</p>
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Slug (tự tạo từ tiêu đề)</label>
            <input
              {...register("slug")}
              readOnly
              disabled
              tabIndex={-1}
              className={`${field} cursor-not-allowed bg-surface-3 text-gray-500 dark:text-gray-400`}
              placeholder="tu-dong-tao-tu-tieu-de"
            />
            <p className={err}>{errors.slug?.message ?? ""}</p>
          </div>

          <div>
            <label className={labelCls}>Thời gian đăng</label>
            <input
              type="datetime-local"
              {...register("publishedAt")}
              className={field}
            />
            <p className={err}>{errors.publishedAt?.message ?? ""}</p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Nội dung</label>
            <Controller
              name="content"
              control={control}
              render={({ field: f }) => (
                <RichTextEditor
                  value={f.value}
                  onChange={f.onChange}
                  placeholder="Nhập nội dung tin tức..."
                />
              )}
            />
            <p className={err}>{errors.content?.message ?? ""}</p>
          </div>
        </form>

        <div className="flex justify-end gap-3 border-t border-app-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-3 dark:border-app-border dark:text-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            form="news-form"
            disabled={submitting}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:opacity-60"
          >
            {submitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

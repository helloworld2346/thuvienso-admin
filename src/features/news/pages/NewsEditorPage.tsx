import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft, FiFileText } from "react-icons/fi";
import {
  useNewsById,
  useCreateNews,
  useUpdateNews,
  useUploadNewsImage,
} from "@/features/news/hooks/useNews";
import type { NewsPayload } from "@/features/news/news.types";
import {
  DOCUMENT_STATUSES,
  DOCUMENT_STATUS_LABELS,
} from "@/features/documents/documents.types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { StateView } from "@/components/ui/StateView";
import { slugify } from "@/utils/slugify";
import { extractImageUrls } from "@/utils/extractImages";
import { ThumbnailPicker } from "@/features/news/components/ThumbnailPicker";

const schema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  slug: z.string().optional(),
  summary: z.string().optional(),
  content: z
    .string()
    .refine(
      (v) => v.replace(/<[^>]*>/g, "").trim().length > 0,
      "Vui lòng nhập nội dung",
    ),
  status: z.enum(DOCUMENT_STATUSES),
  categoryEntity: z.string().min(1, "Vui lòng chọn danh mục"),
  publishedAt: z.string().optional(),
  thumbnail: z.string().optional(),
});

type NewsFormValues = z.infer<typeof schema>;

const emptyValues: NewsFormValues = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  status: "Pending",
  categoryEntity: "",
  publishedAt: "",
  thumbnail: "",
};

const STATUS_OPTIONS = DOCUMENT_STATUSES.map((s) => ({
  value: s,
  label: DOCUMENT_STATUS_LABELS[s],
}));

export default function NewsEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: editing, isLoading, isError } = useNewsById(id);
  const createMut = useCreateNews();
  const updateMut = useUpdateNews();
  const uploadImageMut = useUploadNewsImage();

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

  useEffect(() => {
    if (!isEdit || !editing) return;
    reset({
      title: editing.title,
      slug: editing.slug ?? "",
      summary: editing.summary ?? "",
      content: editing.content,
      status: editing.status,
      categoryEntity: editing.categoryEntity?.idCategory ?? "",
      publishedAt: editing.publishedAt
        ? new Date(editing.publishedAt).toISOString().slice(0, 16)
        : "",
      thumbnail: editing.thumbnail ?? "",
    });
  }, [isEdit, editing, reset]);

  const title = watch("title");
  useEffect(() => {
    setValue("slug", slugify(title ?? ""), { shouldValidate: false });
  }, [title, setValue]);

  const content = watch("content");
  const thumbnail = watch("thumbnail");
  const imageOptions = useMemo(
    () => extractImageUrls(content ?? ""),
    [content],
  );

  useEffect(() => {
    if (thumbnail && !imageOptions.includes(thumbnail)) {
      setValue("thumbnail", "", { shouldValidate: false });
    }
  }, [imageOptions, thumbnail, setValue]);

  const submit = (data: NewsFormValues) => {
    const payload: NewsPayload = {
      ...data,
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : undefined,
    };
    if (isEdit && id) {
      updateMut.mutate(
        { id, payload },
        { onSuccess: () => navigate("/dashboard/news") },
      );
    } else {
      createMut.mutate(payload, {
        onSuccess: () => navigate("/dashboard/news"),
      });
    }
  };

  const submitting = createMut.isPending || updateMut.isPending;

  const field =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500";
  const err = "mt-1 min-h-[1rem] text-xs text-red-600 dark:text-red-400";
  const labelCls =
    "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="space-y-6">
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
              {isEdit ? "Sửa tin tức" : "Thêm tin tức"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEdit ? "Cập nhật nội dung tin tức" : "Soạn tin tức mới"}
            </p>
          </div>
        </div>
      </div>

      <StateView
        isLoading={isEdit && isLoading}
        isError={isEdit && isError}
        errorText="Không tải được tin tức."
      >
        <form
          id="news-form"
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
        >
          {/* Cột trái: nội dung chính */}
          <div className="space-y-4 rounded-2xl border border-app-border bg-surface-2 p-6 lg:col-span-2">
            <div>
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
              <label className={labelCls}>Mô tả ngắn</label>
              <textarea
                {...register("summary")}
                rows={8}
                className={field}
                placeholder="Tóm tắt ngắn gọn nội dung"
              />
              <p className={err} />
            </div>

            <div>
              <label className={labelCls}>Nội dung</label>
              <Controller
                name="content"
                control={control}
                render={({ field: f }) => (
                  <RichTextEditor
                    value={f.value}
                    onChange={f.onChange}
                    placeholder="Nhập nội dung tin tức..."
                    onUploadImage={(file) => uploadImageMut.mutateAsync(file)}
                  />
                )}
              />
              <p className={err}>{errors.content?.message ?? ""}</p>
            </div>
          </div>

          {/* Cột phải: panel thiết lập (sticky) */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-4 rounded-2xl border border-app-border bg-surface-2 p-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Thiết lập
              </h2>

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
                        loadingCategories
                          ? "Đang tải..."
                          : "-- Chọn danh mục --"
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

              <div>
                <label className={labelCls}>Ngày đăng</label>
                <input
                  type="datetime-local"
                  {...register("publishedAt")}
                  className={field}
                />
                <p className={err} />
              </div>

              <div>
                <label className={labelCls}>Ảnh đại diện</label>
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field: f }) => (
                    <ThumbnailPicker
                      images={imageOptions}
                      value={f.value ?? ""}
                      onChange={f.onChange}
                    />
                  )}
                />
                <p className={err} />
              </div>

              <div>
                <label className={labelCls}>Slug</label>
                <input
                  {...register("slug")}
                  readOnly
                  disabled
                  tabIndex={-1}
                  className={`${field} cursor-not-allowed bg-surface-3 text-gray-500`}
                  placeholder="tu-dong-tao-tu-tieu-de"
                />
                <p className={err} />
              </div>

              <div className="flex flex-col gap-2 border-t border-app-border pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full justify-center"
                >
                  {submitting ? "Đang lưu..." : "Lưu"}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/news")}
                  className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-3 dark:border-app-border dark:text-gray-300"
                >
                  Huỷ
                </button>
              </div>
            </div>
          </aside>
        </form>
      </StateView>
    </div>
  );
}

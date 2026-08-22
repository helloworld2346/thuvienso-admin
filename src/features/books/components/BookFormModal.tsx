import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select } from "@/components/ui/Select";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX, FiBook, FiUploadCloud, FiImage } from "react-icons/fi";
import type { Book } from "@/features/books/books.types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useModalA11y } from "@/hooks/useModalA11y";
import { createPortal } from "react-dom";

const currentYear = new Date().getFullYear();

const schema = z.object({
  bookCode: z.string().min(1, "Vui lòng nhập mã sách"),
  title: z.string().min(1, "Vui lòng nhập tên sách"),
  author: z.string().min(1, "Vui lòng nhập tác giả"),
  publisher: z.string().min(1, "Vui lòng nhập nhà xuất bản"),
  publishYear: z.coerce
    .number({ invalid_type_error: "Năm xuất bản không hợp lệ" })
    .int()
    .min(1, "Năm xuất bản không hợp lệ")
    .max(currentYear + 1, "Năm xuất bản không hợp lệ"),
  shelfLocation: z.string().min(1, "Vui lòng nhập vị trí kệ"),
  totalCopies: z.coerce
    .number({ invalid_type_error: "Số lượng không hợp lệ" })
    .int()
    .min(0, "Số lượng không hợp lệ"),
  categoryEntity: z.string().min(1, "Vui lòng chọn danh mục"),
});

type BookFormValues = z.infer<typeof schema>;

interface BookFormModalProps {
  open: boolean;
  editing: Book | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: BookFormValues,
    file: File | null,
    cover: File | null,
  ) => void;
}

const emptyValues: BookFormValues = {
  bookCode: "",
  title: "",
  author: "",
  publisher: "",
  publishYear: currentYear,
  shelfLocation: "",
  totalCopies: 1,
  categoryEntity: "",
};

export function BookFormModal({
  open,
  editing,
  submitting,
  onClose,
  onSubmit,
}: BookFormModalProps) {
  const panelRef = useModalA11y<HTMLDivElement>({
    open,
    onClose,
    locked: submitting,
  });

  const { data: categories, isLoading: loadingCategories } = useCategories();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [cover, setCover] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    setFile(null);
    setFileError("");
    setCover(null);
    reset(
      editing
        ? {
            bookCode: editing.bookCode,
            title: editing.title,
            author: editing.author,
            publisher: editing.publisher,
            publishYear: editing.publishYear,
            shelfLocation: editing.shelfLocation,
            totalCopies: editing.totalCopies,
            categoryEntity: "",
          }
        : emptyValues,
    );
  }, [open, editing, reset]);

  if (!open) return null;

  const field =
    "w-full rounded-xl border border-gray-300 bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500";
  const err = "mt-1 min-h-[1rem] text-xs text-red-600 dark:text-red-400";
  const labelCls =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400";

  const submit = (values: BookFormValues) => {
    if (!editing && !file) {
      setFileError("Vui lòng chọn file");
      return;
    }
    onSubmit(values, file, cover);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="relative overflow-hidden rounded-t-3xl bg-primary px-6 py-5 dark:bg-gradient-to-br dark:from-primary-800 dark:to-primary-900">
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
                <FiBook size={22} className="text-white" />
              </span>
              <div>
                <h2
                  id="book-form-title"
                  className="text-lg font-bold text-white"
                >
                  {editing ? "Sửa sách" : "Thêm sách"}
                </h2>
                <p className="text-xs text-white/70">
                  {editing
                    ? "Cập nhật thông tin đầu sách"
                    : "Thêm đầu sách mới vào kho"}
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
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="min-h-0 flex-1 overflow-y-auto p-6"
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Tên sách</label>
              <input
                {...register("title")}
                autoFocus
                className={field}
                placeholder="Nhập tên sách"
              />
              <p className={err}>{errors.title?.message ?? ""}</p>
            </div>

            <div>
              <label className={labelCls}>Mã sách</label>
              <input
                {...register("bookCode")}
                className={field}
                placeholder="VD: QS-001"
              />
              <p className={err}>{errors.bookCode?.message ?? ""}</p>
            </div>

            <div>
              <label className={labelCls}>Danh mục</label>
              <Controller
                name="categoryEntity"
                control={control}
                render={({ field }) => (
                  <Select
                    aria-label="Chọn danh mục"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={loadingCategories}
                    invalid={!!errors.categoryEntity}
                    placeholder={
                      loadingCategories ? "Đang tải..." : "-- Chọn danh mục --"
                    }
                    options={(categories ?? []).map((c) => ({
                      value: c.idCategory,
                      label: c.categoryName,
                    }))}
                  />
                )}
              />
              <p className={err}>{errors.categoryEntity?.message ?? ""}</p>
            </div>

            <div>
              <label className={labelCls}>Tác giả</label>
              <input
                {...register("author")}
                className={field}
                placeholder="Tác giả"
              />
              <p className={err}>{errors.author?.message ?? ""}</p>
            </div>

            <div>
              <label className={labelCls}>Nhà xuất bản</label>
              <input
                {...register("publisher")}
                className={field}
                placeholder="Nhà xuất bản"
              />
              <p className={err}>{errors.publisher?.message ?? ""}</p>
            </div>

            <div>
              <label className={labelCls}>Năm xuất bản</label>
              <input
                type="number"
                {...register("publishYear")}
                className={field}
              />
              <p className={err}>{errors.publishYear?.message ?? ""}</p>
            </div>

            <div>
              <label className={labelCls}>Vị trí kệ</label>
              <input
                {...register("shelfLocation")}
                className={field}
                placeholder="VD: A1-03"
              />
              <p className={err}>{errors.shelfLocation?.message ?? ""}</p>
            </div>

            <div>
              <label className={labelCls}>Số lượng</label>
              <Controller
                name="totalCopies"
                control={control}
                render={({ field }) => (
                  <NumberStepper
                    aria-label="Số lượng"
                    value={field.value}
                    onChange={field.onChange}
                    min={0}
                    invalid={!!errors.totalCopies}
                  />
                )}
              />
              <p className={err}>{errors.totalCopies?.message ?? ""}</p>
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>
                File {editing ? "(bỏ trống nếu không đổi)" : ""}
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-surface px-3.5 py-3 text-sm transition-colors hover:border-primary hover:bg-primary/5 dark:border-app-border dark:bg-surface-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <FiUploadCloud size={18} />
                </span>
                <span className="min-w-0 flex-1 truncate text-gray-600 dark:text-gray-300">
                  {file ? file.name : "Chọn file tài liệu sách"}
                </span>
                <input
                  type="file"
                  aria-label="Chọn file sách"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setFileError("");
                  }}
                  className="hidden"
                />
              </label>
              <p className={err}>{fileError}</p>
            </div>

            {!editing && (
              <div className="sm:col-span-2">
                <label className={labelCls}>Ảnh bìa (tuỳ chọn)</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-surface px-3.5 py-3 text-sm transition-colors hover:border-primary hover:bg-primary/5 dark:border-app-border dark:bg-surface-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                    <FiImage size={18} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-gray-600 dark:text-gray-300">
                    {cover ? cover.name : "Chọn ảnh bìa"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    aria-label="Chọn ảnh bìa"
                    onChange={(e) => setCover(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 min-h-[1rem] text-xs text-gray-400 dark:text-gray-500">
                  Nếu không chọn, hệ thống sẽ tự tạo ảnh bìa từ trang đầu tiên
                  trong tài liệu.
                </p>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-end gap-3 border-t border-app-border bg-surface-2 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-surface-3 dark:border-app-border dark:text-gray-300"
          >
            Huỷ
          </button>
          <button
            type="submit"
            onClick={handleSubmit(submit)}
            disabled={submitting}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:opacity-60"
          >
            {submitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

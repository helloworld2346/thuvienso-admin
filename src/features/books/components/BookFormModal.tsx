import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import type { Book } from "@/features/books/books.types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useModalA11y } from "@/hooks/useModalA11y";

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
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const err = "mt-1 min-h-[1rem] text-xs text-red-600";

  const submit = (values: BookFormValues) => {
    if (!editing && !file) {
      setFileError("Vui lòng chọn file");
      return;
    }
    onSubmit(values, file, cover);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="book-form-title" className="text-lg font-bold text-gray-900">
            {editing ? "Sửa sách" : "Thêm sách"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên sách
            </label>
            <input
              {...register("title")}
              autoFocus
              className={field}
              placeholder="Nhập tên sách"
            />
            <p className={err}>{errors.title?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mã sách
            </label>
            <input
              {...register("bookCode")}
              className={field}
              placeholder="VD: QS-001"
            />
            <p className={err}>{errors.bookCode?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Danh mục
            </label>
            <select
              {...register("categoryEntity")}
              disabled={loadingCategories}
              className={field}
              aria-label="Chọn danh mục"
            >
              <option value="">
                {loadingCategories ? "Đang tải..." : "-- Chọn danh mục --"}
              </option>
              {(categories ?? []).map((c) => (
                <option key={c.idCategory} value={c.idCategory}>
                  {c.categoryName}
                </option>
              ))}
            </select>
            <p className={err}>{errors.categoryEntity?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tác giả
            </label>
            <input
              {...register("author")}
              className={field}
              placeholder="Tác giả"
            />
            <p className={err}>{errors.author?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nhà xuất bản
            </label>
            <input
              {...register("publisher")}
              className={field}
              placeholder="Nhà xuất bản"
            />
            <p className={err}>{errors.publisher?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Năm xuất bản
            </label>
            <input
              type="number"
              {...register("publishYear")}
              className={field}
            />
            <p className={err}>{errors.publishYear?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Vị trí kệ
            </label>
            <input
              {...register("shelfLocation")}
              className={field}
              placeholder="VD: A1-03"
            />
            <p className={err}>{errors.shelfLocation?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Số lượng
            </label>
            <input
              type="number"
              {...register("totalCopies")}
              className={field}
            />
            <p className={err}>{errors.totalCopies?.message ?? ""}</p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              File {editing ? "(bỏ trống nếu không đổi)" : ""}
            </label>
            <input
              type="file"
              aria-label="Chọn file sách"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setFileError("");
              }}
              className="w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
            />
            <p className={err}>{fileError}</p>
          </div>

          {!editing && (
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ảnh bìa (tuỳ chọn)
              </label>
              <input
                type="file"
                accept="image/*"
                aria-label="Chọn ảnh bìa"
                onChange={(e) => setCover(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
              />
              <p className="mt-1 min-h-[1rem] text-xs text-gray-400">
                Nếu không chọn, hệ thống sẽ tự tạo ảnh bìa.
              </p>
            </div>
          )}

          <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

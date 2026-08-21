import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import type { Category } from "@/features/categories/categories.types";
import { useModalA11y } from "@/hooks/useModalA11y";

const schema = z.object({
  categoryName: z.string().min(1, "Vui lòng nhập tên danh mục"),
});

type FormData = z.infer<typeof schema>;

interface CategoryFormModalProps {
  open: boolean;
  editing: Category | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function CategoryFormModal({
  open,
  editing,
  submitting,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const panelRef = useModalA11y<HTMLDivElement>({
    open,
    onClose,
    locked: submitting,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { categoryName: "" },
  });

  useEffect(() => {
    if (open) reset({ categoryName: editing?.categoryName ?? "" });
  }, [open, editing, reset]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-surface-2 p-6 shadow-xl  dark:ring-1 dark:ring-white/10"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="category-form-title"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            {editing ? "Sửa danh mục" : "Thêm danh mục"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tên danh mục
          </label>
          <input
            {...register("categoryName")}
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Nhập tên danh mục"
          />
          <p className="mt-1.5 min-h-[1.25rem] text-sm text-red-600 dark:text-red-400">
            {errors.categoryName?.message ?? ""}
          </p>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
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

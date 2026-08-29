import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import type { Category } from "@/features/categories/categories.types";
import { useModalA11y } from "@/hooks/useModalA11y";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const schema = z.object({
  categoryName: z.string().min(1, "Vui lòng nhập tên danh mục"),
  parentCategory: z.string().optional(),
  isDisplay: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface CategoryFormModalProps {
  open: boolean;
  editing: Category | null;
  categories: Category[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function CategoryFormModal({
  open,
  editing,
  categories,
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
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { categoryName: "", parentCategory: "", isDisplay: true },
  });

  useEffect(() => {
    if (open)
      reset({
        categoryName: editing?.categoryName ?? "",
        parentCategory: "",
        isDisplay: true,
      });
  }, [open, editing, reset]);

  if (!open) return null;

  const parentOptions = [
    { value: "", label: "-- Không có (danh mục gốc) --" },
    ...categories
      .filter((c) => c.idCategory !== editing?.idCategory)
      .map((c) => ({ value: c.idCategory, label: c.categoryName })),
  ];

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
        className="w-full max-w-md rounded-2xl bg-surface-2 p-6 shadow-xl dark:ring-1 dark:ring-white/10"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Nhập tên danh mục"
          />
          <p className="mt-1.5 min-h-[1.25rem] text-sm text-red-600 dark:text-red-400">
            {errors.categoryName?.message ?? ""}
          </p>

          {!editing && (
            <>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Danh mục cha
              </label>
              <Controller
                name="parentCategory"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={parentOptions}
                    aria-label="Chọn danh mục cha"
                  />
                )}
              />

              <label className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  {...register("isDisplay")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Hiển thị danh mục
              </label>
            </>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

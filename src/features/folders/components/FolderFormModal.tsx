import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import type { Folder } from "@/features/folders/folders.types";
import { useModalA11y } from "@/hooks/useModalA11y";

const schema = z.object({
  folderName: z.string().min(1, "Vui lòng nhập tên thư mục"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface FolderFormModalProps {
  open: boolean;
  editing: Folder | null;
  parentName?: string | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function FolderFormModal({
  open,
  editing,
  parentName,
  submitting,
  onClose,
  onSubmit,
}: FolderFormModalProps) {
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
    defaultValues: { folderName: "", description: "" },
  });

  useEffect(() => {
    if (open)
      reset({
        folderName: editing?.folderName ?? "",
        description: editing?.description ?? "",
      });
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
        aria-labelledby="folder-form-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-surface-2 p-6 shadow-xl dark:ring-1 dark:ring-white/10"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="folder-form-title"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            {editing
              ? "Sửa thư mục"
              : parentName
                ? `Thêm thư mục con trong "${parentName}"`
                : "Thêm thư mục"}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tên thư mục
          </label>
          <input
            {...register("folderName")}
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100"
            placeholder="Nhập tên thư mục"
          />
          <p className="mt-1.5 min-h-[1.25rem] text-sm text-red-600 dark:text-red-400">
            {errors.folderName?.message ?? ""}
          </p>

          {!editing && (
            <>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mô tả
              </label>
              <input
                {...register("description")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100"
                placeholder="Mô tả (tuỳ chọn)"
              />
            </>
          )}

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-app-border-strong px-4 py-2 text-sm text-gray-700 hover:bg-surface-muted dark:text-gray-300"
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

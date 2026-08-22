import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import type { Collection } from "@/features/collections/collections.types";
import {
  COLLECTION_TYPES,
  COLLECTION_TYPE_LABELS,
} from "@/features/collections/collections.types";
import { useModalA11y } from "@/hooks/useModalA11y";
import { Select } from "@/components/ui/Select";

const schema = z.object({
  collectionName: z.string().min(1, "Vui lòng nhập tên bộ sưu tập"),
  typeCollection: z.enum(COLLECTION_TYPES),
});

type FormData = z.infer<typeof schema>;

interface CollectionFormModalProps {
  open: boolean;
  editing: Collection | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const TYPE_OPTIONS = COLLECTION_TYPES.map((t) => ({
  value: t,
  label: COLLECTION_TYPE_LABELS[t],
}));

export function CollectionFormModal({
  open,
  editing,
  submitting,
  onClose,
  onSubmit,
}: CollectionFormModalProps) {
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
    defaultValues: { collectionName: "", typeCollection: "FEATURED" },
  });

  useEffect(() => {
    if (open)
      reset({
        collectionName: editing?.collectionName ?? "",
        typeCollection: editing?.typeCollection ?? "FEATURED",
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
        aria-labelledby="collection-form-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-surface-2 p-6 shadow-xl dark:ring-1 dark:ring-white/10"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="collection-form-title"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            {editing ? "Sửa bộ sưu tập" : "Thêm bộ sưu tập"}
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
            Tên bộ sưu tập
          </label>
          <input
            {...register("collectionName")}
            autoFocus
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500"
            placeholder="Nhập tên bộ sưu tập"
          />
          <p className="mt-1.5 min-h-[1.25rem] text-sm text-red-600 dark:text-red-400">
            {errors.collectionName?.message ?? ""}
          </p>

          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Loại bộ sưu tập
          </label>
          <Controller
            name="typeCollection"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={TYPE_OPTIONS}
                invalid={!!errors.typeCollection}
                aria-label="Chọn loại bộ sưu tập"
              />
            )}
          />
          <p className="mt-1.5 min-h-[1.25rem] text-sm text-red-600 dark:text-red-400">
            {errors.typeCollection?.message ?? ""}
          </p>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-surface-3 dark:border-app-border dark:text-gray-300 dark:hover:bg-gray-800"
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

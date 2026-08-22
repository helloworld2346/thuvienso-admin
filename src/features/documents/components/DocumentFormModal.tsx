import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX, FiFileText } from "react-icons/fi";
import type { Document } from "@/features/documents/documents.types";
import {
  DOCUMENT_TYPES,
  DOCUMENT_STATUSES,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_STATUS_LABELS,
} from "@/features/documents/documents.types";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useModalA11y } from "@/hooks/useModalA11y";
import { Select } from "@/components/ui/Select";

const schema = z
  .object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    content: z.string().min(1, "Vui lòng nhập nội dung"),
    typeDocument: z.enum(DOCUMENT_TYPES),
    status: z.enum(DOCUMENT_STATUSES),
    categoryEntity: z.string().optional(),
    isEditing: z.boolean(),
  })
  .superRefine((val, ctx) => {
    // Chỉ bắt buộc chọn danh mục khi tạo mới (POST /documents cần categoryEntity)
    if (!val.isEditing && !val.categoryEntity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryEntity"],
        message: "Vui lòng chọn danh mục",
      });
    }
  });

type DocumentFormValues = z.infer<typeof schema>;

interface DocumentFormModalProps {
  open: boolean;
  editing: Document | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentFormValues) => void;
}

const emptyValues: DocumentFormValues = {
  title: "",
  content: "",
  typeDocument: "ARTICLE",
  status: "Pending",
  categoryEntity: "",
  isEditing: false,
};

const TYPE_OPTIONS = DOCUMENT_TYPES.map((t) => ({
  value: t,
  label: DOCUMENT_TYPE_LABELS[t],
}));
const STATUS_OPTIONS = DOCUMENT_STATUSES.map((s) => ({
  value: s,
  label: DOCUMENT_STATUS_LABELS[s],
}));

export function DocumentFormModal({
  open,
  editing,
  submitting,
  onClose,
  onSubmit,
}: DocumentFormModalProps) {
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
    formState: { errors },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      editing
        ? {
            title: editing.title,
            content: editing.content,
            typeDocument: editing.typeDocument,
            status: editing.status,
            categoryEntity: "",
            isEditing: true,
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
        aria-labelledby="document-form-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
      >
        <div className="flex items-center justify-between bg-primary px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <FiFileText size={22} />
            </span>
            <div>
              <h2 id="document-form-title" className="text-lg font-bold">
                {editing ? "Sửa tài liệu" : "Thêm tài liệu"}
              </h2>
              <p className="text-sm text-white/75">
                {editing ? "Cập nhật thông tin tài liệu" : "Thêm tài liệu mới"}
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
          id="document-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-6 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className={labelCls}>Tiêu đề</label>
            <input
              {...register("title")}
              autoFocus
              className={field}
              placeholder="Nhập tiêu đề tài liệu"
            />
            <p className={err}>{errors.title?.message ?? ""}</p>
          </div>

          <div>
            <label className={labelCls}>Loại tài liệu</label>
            <Controller
              name="typeDocument"
              control={control}
              render={({ field: f }) => (
                <Select
                  value={f.value}
                  onChange={f.onChange}
                  options={TYPE_OPTIONS}
                  aria-label="Chọn loại tài liệu"
                />
              )}
            />
            <p className={err}>{errors.typeDocument?.message ?? ""}</p>
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

          {!editing && (
            <div className="sm:col-span-2">
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
          )}

          <div className="sm:col-span-2">
            <label className={labelCls}>Nội dung</label>
            <textarea
              {...register("content")}
              rows={4}
              className={field}
              placeholder="Mô tả / nội dung tài liệu"
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
            form="document-form"
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

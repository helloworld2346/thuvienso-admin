import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import type { Document } from "@/features/documents/documents.types";
import {
  DOCUMENT_TYPES,
  DOCUMENT_STATUSES,
} from "@/features/documents/documents.types";
import { useModalA11y } from "@/hooks/useModalA11y";

const schema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  content: z.string().min(1, "Vui lòng nhập nội dung"),
  typeDocument: z.enum(DOCUMENT_TYPES),
  status: z.enum(DOCUMENT_STATUSES),
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
};

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

  const {
    register,
    handleSubmit,
    reset,
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
          }
        : emptyValues,
    );
  }, [open, editing, reset]);

  if (!open) return null;

  const field =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
  const err = "mt-1 min-h-[1rem] text-xs text-red-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-form-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="document-form-title"
            className="text-lg font-bold text-gray-900"
          >
            {editing ? "Sửa tài liệu" : "Thêm tài liệu"}
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
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              {...register("title")}
              autoFocus
              className={field}
              placeholder="Nhập tiêu đề tài liệu"
            />
            <p className={err}>{errors.title?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Loại tài liệu
            </label>
            <select
              {...register("typeDocument")}
              className={field}
              aria-label="Chọn loại tài liệu"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <p className={err}>{errors.typeDocument?.message ?? ""}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              {...register("status")}
              className={field}
              aria-label="Chọn trạng thái"
            >
              {DOCUMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className={err}>{errors.status?.message ?? ""}</p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nội dung
            </label>
            <textarea
              {...register("content")}
              rows={4}
              className={field}
              placeholder="Mô tả / nội dung tài liệu"
            />
            <p className={err}>{errors.content?.message ?? ""}</p>
          </div>

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

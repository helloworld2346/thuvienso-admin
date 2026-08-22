import { FiAlertTriangle } from "react-icons/fi";
import { useModalA11y } from "@/hooks/useModalA11y";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Xoá",
  cancelText = "Huỷ",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const panelRef = useModalA11y<HTMLDivElement>({
    open,
    onClose,
    locked: loading,
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => !loading && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-surface-2 p-6 shadow-xl dark:ring-1 dark:ring-white/10"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <FiAlertTriangle size={20} />
          </span>
          <div className="flex-1">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-bold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xoá..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

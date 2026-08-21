import { FiCheck, FiX, FiAlertTriangle } from "react-icons/fi";
import { useToastStore, type ToastType } from "@/store/toast.store";

const styles: Record<ToastType, { box: string; icon: JSX.Element }> = {
  success: {
    box: "bg-green-100 text-green-500",
    icon: <FiCheck size={18} />,
  },
  error: {
    box: "bg-red-100 text-red-500",
    icon: <FiX size={18} />,
  },
  info: {
    box: "bg-orange-100 text-orange-500",
    icon: <FiAlertTriangle size={18} />,
  },
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className="toast-in pointer-events-auto flex w-full items-center rounded-lg bg-surface-3 p-4 text-gray-500 shadow ring-1 ring-black/5 dark:text-gray-300 dark:ring-white/10"
        >
          <div
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles[t.type].box}`}
          >
            {styles[t.type].icon}
            <span className="sr-only">{t.type} icon</span>
          </div>

          <div className="ml-3 text-sm font-normal text-gray-800 dark:text-gray-100">
            {t.message}
          </div>

          <button
            type="button"
            onClick={() => remove(t.id)}
            className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-3 p-1.5 text-gray-400 transition-colors hover:bg-surface-muted hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:text-gray-100"
            aria-label="Đóng"
          >
            <span className="sr-only">Đóng</span>
            <FiX size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

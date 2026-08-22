import type { ReactNode } from "react";

interface StateViewProps {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
  emptyIcon?: ReactNode;
  children: ReactNode;
}

export function StateView({
  isLoading,
  isError,
  isEmpty,
  loadingText = "Đang tải...",
  errorText = "Không tải được dữ liệu.",
  emptyText = "Chưa có dữ liệu.",
  emptyIcon,
  children,
}: StateViewProps) {
  if (isLoading)
    return (
      <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
        {loadingText}
      </p>
    );
  if (isError)
    return (
      <p className="py-16 text-center text-sm text-red-600 dark:text-red-400">
        {errorText}
      </p>
    );
  if (isEmpty)
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        {emptyIcon && (
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20">
            {emptyIcon}
          </span>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</p>
      </div>
    );
  return <>{children}</>;
}

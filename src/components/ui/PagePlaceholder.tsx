interface PagePlaceholderProps {
  title: string;
  description?: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="rounded-xl border border-app-border bg-surface-2 p-6">
      {" "}
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

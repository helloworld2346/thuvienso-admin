import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Tạo danh sách trang có ellipsis theo kiểu shadcn: 1 … 4 5 [6] 7 8 … 20
function getPageItems(page: number, totalPages: number): (number | "…")[] {
  const items: (number | "…")[] = [];
  const siblings = 1;
  const boundary = 1;

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  if (totalPages <= boundary * 2 + siblings * 2 + 3) {
    return range(1, totalPages);
  }

  const left = Math.max(page - siblings, boundary + 2);
  const right = Math.min(page + siblings, totalPages - boundary - 1);

  items.push(...range(1, boundary));
  if (left > boundary + 2) items.push("…");
  else if (boundary + 1 < left) items.push(boundary + 1);

  items.push(...range(left, right));

  if (right < totalPages - boundary - 1) items.push("…");
  else if (right + 1 < totalPages - boundary + 1)
    items.push(totalPages - boundary);

  items.push(...range(totalPages - boundary + 1, totalPages));
  return items;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const linkBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors";

  return (
    <nav
      role="navigation"
      aria-label="Phân trang"
      className="mx-auto flex w-full justify-center"
    >
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            onClick={() => canPrev && onPageChange(page - 1)}
            disabled={!canPrev}
            aria-label="Trang trước"
            className={`${linkBase} gap-1 text-gray-700 hover:bg-surface-3 disabled:pointer-events-none disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800`}
          >
            <FiChevronLeft size={16} />
            <span className="hidden sm:inline">Trước</span>
          </button>
        </li>

        {items.map((it, idx) =>
          it === "…" ? (
            <li key={`e-${idx}`}>
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center text-gray-400 dark:text-gray-500"
              >
                <FiMoreHorizontal size={16} />
              </span>
            </li>
          ) : (
            <li key={it}>
              <button
                type="button"
                onClick={() => onPageChange(it)}
                aria-current={it === page ? "page" : undefined}
                className={`${linkBase} ${
                  it === page
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "text-gray-700 hover:bg-surface-3 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {it}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={() => canNext && onPageChange(page + 1)}
            disabled={!canNext}
            aria-label="Trang sau"
            className={`${linkBase} gap-1 text-gray-700 hover:bg-surface-3 disabled:pointer-events-none disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800`}
          >
            <span className="hidden sm:inline">Sau</span>
            <FiChevronRight size={16} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

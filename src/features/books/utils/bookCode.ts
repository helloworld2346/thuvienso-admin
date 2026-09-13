import type { Category } from "@/features/categories/categories.types";

function slugPrefix(name: string): string {
  const noAccent = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const words = noAccent.trim().split(/\s+/).filter(Boolean);

  const initials = words
    .map((w) => w[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();

  const clean = initials.replace(/[^A-Z]/g, "");
  return clean || "BK";
}

function randomSuffix(len = 5): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/**
 * Sinh mã sách dạng PREFIX-YYYY-RAND, ví dụ: SN-2026-K7QX3
 * @param categoryId id danh mục đang chọn
 * @param categories danh sách danh mục để tra tên
 * @param year năm xuất bản
 * @param existing danh sách mã đã tồn tại (để tránh trùng)
 */
export function generateBookCode(
  categoryId: string,
  categories: Category[],
  year: number,
  existing: string[] = [],
): string {
  const cat = categories.find((c) => c.idCategory === categoryId);
  const prefix = cat ? slugPrefix(cat.categoryName) : "BK";
  const taken = new Set(existing.map((c) => c.toUpperCase()));

  for (let i = 0; i < 10; i += 1) {
    const code = `${prefix}-${year}-${randomSuffix(5)}`;
    if (!taken.has(code.toUpperCase())) return code;
  }
  return `${prefix}-${year}-${randomSuffix(8)}`;
}

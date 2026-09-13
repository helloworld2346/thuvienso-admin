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

function findCategory(list: Category[], id: string): Category | undefined {
  for (const c of list) {
    if (c.idCategory === id) return c;
    const child = c.childCategory
      ? findCategory(c.childCategory, id)
      : undefined;
    if (child) return child;
  }
  return undefined;
}

export function randomCodeSuffix(len = 5): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/**
 * Sinh mã sách:
 *  - Có năm  -> PREFIX-YYYY-RAND (VD: SN-2024-K7QX3)
 *  - Trống năm -> PREFIX-RAND   (VD: SN-K7QX3)
 * @param categoryId  id danh mục đang chọn
 * @param categories  cây danh mục để tra tên
 * @param year        năm xuất bản (undefined nếu ô đang trống)
 * @param existing    danh sách mã đã tồn tại (tránh trùng)
 * @param fixedSuffix nếu truyền vào thì giữ nguyên phần random (dùng khi chỉ đổi năm)
 */
export function generateBookCode(
  categoryId: string,
  categories: Category[],
  year?: number,
  existing: string[] = [],
  fixedSuffix?: string,
): string {
  const cat = findCategory(categories, categoryId);
  const prefix = cat ? slugPrefix(cat.categoryName) : "BK";
  const yearPart = year ? `${year}-` : "";
  const taken = new Set(existing.map((c) => c.toUpperCase()));

  if (fixedSuffix) {
    return `${prefix}-${yearPart}${fixedSuffix}`;
  }

  for (let i = 0; i < 10; i += 1) {
    const code = `${prefix}-${yearPart}${randomCodeSuffix(5)}`;
    if (!taken.has(code.toUpperCase())) return code;
  }
  return `${prefix}-${yearPart}${randomCodeSuffix(8)}`;
}

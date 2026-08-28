export function slugify(input: string): string {
  return input
    .normalize("NFD") // tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu tiếng Việt
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-") // khoảng trắng -> gạch
    .replace(/-+/g, "-") // gộp gạch liên tiếp
    .replace(/^-+|-+$/g, ""); // bỏ gạch đầu/cuối
}

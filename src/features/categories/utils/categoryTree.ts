import type { Category } from "@/features/categories/categories.types";
import type { SelectOption } from "@/components/ui/Select";

function parentIdOf(c: Category): string | null {
  const p = c.parentCategory;
  if (!p) return null;
  if (typeof p === "string") return p;
  return p.idCategory ?? null;
}

export function flattenCategoryOptions(list: Category[]): SelectOption[] {
  const byId = new Map<string, Category>();
  const childrenByParent = new Map<string, Category[]>();
  const roots: Category[] = [];

  list.forEach((c) => byId.set(c.idCategory, c));

  list.forEach((c) => {
    const pid = parentIdOf(c);
    if (pid && byId.has(pid)) {
      const arr = childrenByParent.get(pid) ?? [];
      arr.push(c);
      childrenByParent.set(pid, arr);
    } else {
      roots.push(c);
    }
  });

  const options: SelectOption[] = [];
  const walk = (node: Category, depth: number) => {
    const prefix = depth === 0 ? "" : `${"— ".repeat(depth)}`;
    options.push({
      value: node.idCategory,
      label: `${prefix}${node.categoryName}`,
    });
    (childrenByParent.get(node.idCategory) ?? []).forEach((child) =>
      walk(child, depth + 1),
    );
  };
  roots.forEach((r) => walk(r, 0));
  return options;
}

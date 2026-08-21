import { NavLink } from "react-router-dom";

export interface SubTabItem {
  to: string;
  label: string;
}

interface SubTabsProps {
  items: SubTabItem[];
}

export function SubTabs({ items }: SubTabsProps) {
  return (
    <nav className="mb-6 flex flex-wrap gap-1 rounded-full border border-app-border bg-surface-2 p-1 shadow-sm">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-gray-600 hover:bg-surface-muted dark:text-gray-300"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

import { Outlet } from "react-router-dom";
import { SubTabs, type SubTabItem } from "@/components/layout/SubTabs";

const TABS: SubTabItem[] = [
  { to: "/dashboard/library/documents", label: "Tài liệu" },
  { to: "/dashboard/library/books", label: "Sách" },
  { to: "/dashboard/library/collections", label: "Bộ sưu tập" },
  { to: "/dashboard/library/folders", label: "Thư mục" },
];

export default function LibraryLayout() {
  return (
    <div>
      <SubTabs items={TABS} />
      <Outlet />
    </div>
  );
}

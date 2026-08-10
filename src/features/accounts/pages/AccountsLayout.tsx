import { Outlet } from "react-router-dom";
import { SubTabs, type SubTabItem } from "@/components/layout/SubTabs";

const TABS: SubTabItem[] = [
  { to: "/dashboard/accounts/users", label: "Người dùng" },
  { to: "/dashboard/accounts/roles", label: "Vai trò" },
];

export default function AccountsLayout() {
  return (
    <div>
      <SubTabs items={TABS} />
      <Outlet />
    </div>
  );
}

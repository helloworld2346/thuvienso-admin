import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import LoginPage from "@/features/auth/pages/LoginPage";
import RootRedirect from "@/routes/RootRedirect";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import LibraryLayout from "@/features/library/pages/LibraryLayout";
import AccountsLayout from "@/features/accounts/pages/AccountsLayout";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: "/login", element: <LoginPage /> }],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          {
            path: "/dashboard/library",
            element: <LibraryLayout />,
            children: [
              { index: true, element: <Navigate to="documents" replace /> },
              {
                path: "documents",
                element: <PagePlaceholder title="Tài liệu" />,
              },
              { path: "books", element: <PagePlaceholder title="Sách" /> },
              {
                path: "collections",
                element: <PagePlaceholder title="Bộ sưu tập" />,
              },
              {
                path: "folders",
                element: <PagePlaceholder title="Thư mục" />,
              },
            ],
          },
          {
            path: "/dashboard/categories",
            element: <CategoriesPage />,
          },
          {
            path: "/dashboard/borrow",
            element: <PagePlaceholder title="Mượn trả" />,
          },
          {
            path: "/dashboard/accounts",
            element: <AccountsLayout />,
            children: [
              { index: true, element: <Navigate to="users" replace /> },
              {
                path: "users",
                element: <PagePlaceholder title="Người dùng" />,
              },
              { path: "roles", element: <PagePlaceholder title="Vai trò" /> },
            ],
          },
          {
            path: "/dashboard/statistics",
            element: <PagePlaceholder title="Thống kê" />,
          },
          {
            path: "/dashboard/audit-logs",
            element: <PagePlaceholder title="Nhật ký" />,
          },
        ],
      },
    ],
  },
  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

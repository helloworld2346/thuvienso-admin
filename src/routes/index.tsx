import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import LoginPage from "@/features/auth/pages/LoginPage";
import RootRedirect from "@/routes/RootRedirect";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

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
            path: "/dashboard/books",
            element: <PagePlaceholder title="Sách" />,
          },
          {
            path: "/dashboard/categories",
            element: <PagePlaceholder title="Danh mục" />,
          },
          {
            path: "/dashboard/users",
            element: <PagePlaceholder title="Người dùng" />,
          },
          {
            path: "/dashboard/news",
            element: <PagePlaceholder title="Tin tức" />,
          },
          {
            path: "/dashboard/borrow",
            element: <PagePlaceholder title="Mượn trả" />,
          },
          {
            path: "/dashboard/statistics",
            element: <PagePlaceholder title="Thống kê" />,
          },
        ],
      },
    ],
  },
  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

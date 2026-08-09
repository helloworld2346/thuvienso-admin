import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import LoginPage from "@/features/auth/pages/LoginPage";

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
          { path: "/dashboard", element: <div>Dashboard</div> },
          { path: "/dashboard/books", element: <div>Books</div> },
          { path: "/dashboard/categories", element: <div>Categories</div> },
          { path: "/dashboard/users", element: <div>Users</div> },
          { path: "/dashboard/news", element: <div>News</div> },
          { path: "/dashboard/borrow", element: <div>Borrow</div> },
          { path: "/dashboard/statistics", element: <div>Statistics</div> },
        ],
      },
    ],
  },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import LoginPage from "@/features/auth/pages/LoginPage";
import RootRedirect from "@/routes/RootRedirect";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import LibraryLayout from "@/features/library/pages/LibraryLayout";
import LibraryHub from "@/features/library/pages/LibraryHub";
import LibrarySubLayout from "@/features/library/pages/LibrarySubLayout";
import AccountsLayout from "@/features/accounts/pages/AccountsLayout";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import BooksPage from "@/features/books/pages/BooksPage";
import DocumentsPage from "@/features/documents/pages/DocumentsPage";
import StatisticsPage from "@/features/dashboard/pages/StatisticsPage";
import FoldersPage from "@/features/folders/pages/FoldersPage";  
import UsersPage from "@/features/accounts/pages/UsersPage";
import RolesPage from "@/features/accounts/pages/RolesPage";
import CollectionsPage from "@/features/collections/pages/CollectionsPage";  
import AuditLogsPage from "@/features/audit-logs/pages/AuditLogsPage";


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
              { index: true, element: <LibraryHub /> },
              {
                element: <LibrarySubLayout />,
                children: [
                  { path: "documents", element: <DocumentsPage /> },

                  { path: "books", element: <BooksPage /> },
                  { path: "collections", element: <CollectionsPage /> },

                  { path: "folders", element: <FoldersPage /> },
                ],
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
              { path: "users", element: <UsersPage /> },
              { path: "roles", element: <RolesPage /> },
            ],
          },
          {
            path: "/dashboard/statistics",
            element: <StatisticsPage />,
          },
          {
            path: "/dashboard/audit-logs",
            element: <AuditLogsPage />,
          },
        ],
      },
    ],
  },
  { path: "/", element: <RootRedirect /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

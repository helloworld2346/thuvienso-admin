import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

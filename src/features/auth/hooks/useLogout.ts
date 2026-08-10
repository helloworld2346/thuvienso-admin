import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useLogout() {
  const navigate = useNavigate();

  return async () => {
    const token = useAuthStore.getState().token;
    try {
      if (token) await authApi.logout(token);
    } catch {
      // Bỏ qua lỗi backend — vẫn đăng xuất phía client
    } finally {
      useAuthStore.getState().logout();
      navigate("/login", { replace: true });
    }
  };
}

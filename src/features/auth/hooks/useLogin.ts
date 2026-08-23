import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "@/store/toast.store";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { LoginPayload } from "@/features/auth/auth.types";

export function useLogin() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (result) => {
      setToken(result.token);
      toast.success("Đăng nhập thành công");
      navigate("/dashboard", { replace: true });
    },
    onError: (error) =>
      toast.error(
        getErrorMessage(error, "Tên đăng nhập hoặc mật khẩu không đúng"),
      ),
  });
}

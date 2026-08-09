import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "@/store/toast.store";
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
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? (error.response?.data as { message?: string })?.message
          : undefined;
      toast.error(message ?? "Tên đăng nhập hoặc mật khẩu không đúng");
    },
  });
}

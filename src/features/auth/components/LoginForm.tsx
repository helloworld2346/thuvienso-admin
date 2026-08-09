import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import { useLogin } from "@/features/auth/hooks/useLogin";

const loginSchema = z.object({
  userName: z.string().min(1, "Vui lòng nhập tài khoản"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userName: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div>
        <label
          htmlFor="userName"
          className="mb-3 block text-sm font-medium text-gray-700"
        >
          Tài khoản
        </label>

        <div className="group relative">
          <FiUser className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />

          <input
            id="userName"
            type="text"
            autoComplete="username"
            placeholder="Nhập tài khoản"
            className={`h-12 w-full border-0 border-b bg-transparent pl-8 pr-2 text-sm text-gray-900 outline-none transition focus:ring-0 ${
              errors.userName
                ? "border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            {...register("userName")}
          />
        </div>

        {errors.userName && (
          <p className="mt-2 text-sm text-red-600">{errors.userName.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-3 block text-sm font-medium text-gray-700"
        >
          Mật khẩu
        </label>

        <div className="group relative">
          <FiLock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary" />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            className={`h-12 w-full border-0 border-b bg-transparent pl-8 pr-10 text-sm text-gray-900 outline-none transition focus:ring-0 ${
              errors.password
                ? "border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            {...register("password")}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-primary"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {isError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {(error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Đăng nhập thất bại. Vui lòng thử lại."}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="group flex h-14 w-full items-center justify-between rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{isPending ? "Đang đăng nhập..." : "Đăng nhập"}</span>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-transform group-hover:translate-x-1">
          <FiArrowRight size={18} />
        </span>
      </button>
    </form>
  );
}

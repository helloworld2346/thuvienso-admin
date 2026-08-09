import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/features/auth/hooks/useLogin";

const schema = z.object({
  userName: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const { mutate, isPending, isError, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => mutate(values);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="userName" className="font-medium text-text">
          Tên đăng nhập
        </label>
        <input
          id="userName"
          type="text"
          autoComplete="username"
          {...register("userName")}
          className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary"
        />
        {errors.userName && (
          <span className="text-red-600">{errors.userName.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-medium text-text">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary"
        />
        {errors.password && (
          <span className="text-red-600">{errors.password.message}</span>
        )}
      </div>

      {isError && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-red-600">
          {(error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Đăng nhập thất bại. Vui lòng thử lại."}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-primary py-2 font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
      >
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

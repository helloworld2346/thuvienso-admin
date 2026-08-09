import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-primary">
        Thư Viện Số Sư Đoàn 5 — Admin
      </h1>
      <LoginForm />
    </div>
  );
}

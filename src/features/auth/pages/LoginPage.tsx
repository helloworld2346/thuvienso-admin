import logo from "@/assets/logos/logo.png";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="auth-mesh" aria-hidden="true">
        <div className="auth-beam" />
        <div className="auth-beam-2" />
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
        <div className="auth-particles">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="auth-card relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white/95 shadow-2xl shadow-black/30 ring-1 ring-white/20 backdrop-blur-xl lg:grid-cols-2">
        <div className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-white">
            <img
              src={logo}
              alt="Sư Đoàn 5"
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>

        <section className="relative hidden overflow-hidden bg-primary p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full border border-white/10" />

          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
              Digital Library
            </p>

            <div className="mt-8 max-w-sm">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                HỆ THỐNG
                <br />
                THƯ VIỆN SỐ
              </h1>

              <div className="mt-6 h-1 w-16 rounded-full bg-white" />

              <p className="mt-6 text-base leading-7 text-white/75">
                Tri thức phục vụ nhiệm vụ.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[8rem] font-black leading-none text-white/[0.06]">
              f5
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Sư Đoàn 5
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex justify-center lg:hidden">
              <img
                src={logo}
                alt="Sư Đoàn 5"
                className="h-16 w-auto object-contain"
              />
            </div>

            <div className="mb-9">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-primary">
                Admin System
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Đăng nhập
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Vui lòng đăng nhập để truy cập hệ thống quản trị.
              </p>
            </div>

            <LoginForm />

            <p className="mt-10 text-xs text-gray-400">
              Hệ thống quản trị · Thư Viện Số Sư Đoàn 5
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

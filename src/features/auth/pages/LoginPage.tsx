import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute -left-[10%] top-0 h-full w-[120%]"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="login-wave login-wave-1"
            d="M-100 620 C180 420 300 760 580 570 C850 390 980 650 1540 350"
          />
          <path
            className="login-wave login-wave-2"
            d="M-100 700 C220 500 360 820 650 630 C920 450 1080 700 1540 420"
          />
          <path
            className="login-wave login-wave-3"
            d="M-100 780 C260 580 420 880 700 690 C980 500 1150 760 1540 500"
          />
          <path
            className="login-wave login-wave-4"
            d="M-100 500 C200 320 340 640 620 470 C880 320 1020 560 1540 260"
          />
          <path
            className="login-wave login-wave-5"
            d="M-100 850 C240 660 400 940 680 760 C960 590 1120 820 1540 560"
          />
        </svg>

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-primary/10 ring-1 ring-black/5 lg:grid-cols-2">
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

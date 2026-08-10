import {
  FiUsers,
  FiBook,
  FiRepeat,
  FiTag,
  FiArrowUpRight,
} from "react-icons/fi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { StatBar } from "@/features/dashboard/components/StatBar";
import { StatNumber } from "@/features/dashboard/components/StatNumber";
import { RingProgress } from "@/features/dashboard/components/RingProgress";

const BARS = [72, 45, 88, 60, 34, 78, 52];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Digital Library
        </p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
          Xin chào, {user?.userName ?? "admin"}
        </h1>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-1 flex-wrap gap-6">
            <StatBar label="Đang mượn" percent={60} />
            <StatBar label="Quá hạn" percent={15} />
            <StatBar label="Sẵn sàng" percent={80} />
          </div>
          <div className="flex gap-8">
            <StatNumber icon={FiBook} value="—" label="Đầu sách" />
            <StatNumber icon={FiUsers} value="—" label="Người dùng" />
            <StatNumber icon={FiRepeat} value="—" label="Lượt mượn" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-white lg:col-span-1">
          <div className="auth-mesh opacity-60" aria-hidden="true" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Thư Viện Số Sư Đoàn 5
            </p>
            <div>
              <p className="text-4xl font-bold">—</p>
              <p className="mt-1 text-white/75">Tổng đầu sách</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Tiến độ trong tuần
            </h2>
            <FiArrowUpRight className="text-gray-400" size={20} />
          </div>
          <div className="mt-8 flex h-40 items-end justify-between gap-2">
            {BARS.map((h, i) => (
              <div
                key={i}
                className={`w-full rounded-full ${
                  i === 5 ? "bg-primary" : "bg-primary/20"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-400">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Tỉ lệ khả dụng</h2>
            <FiArrowUpRight className="text-gray-400" size={20} />
          </div>
          <div className="mt-4 flex flex-1 items-center">
            <RingProgress percent={0} label="—" caption="Khả dụng" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FiTag size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Hoạt động gần đây
            </h2>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Chưa có dữ liệu. Kết nối API để hiển thị.
          </p>
        </div>

        <div className="rounded-3xl bg-primary-hover p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Cần xử lý</h2>
            <span className="text-sm text-white/60">0/0</span>
          </div>
          <p className="mt-4 text-sm text-white/70">Chưa có dữ liệu.</p>
        </div>
      </div>
    </div>
  );
}

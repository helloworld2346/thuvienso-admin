import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import { useModalA11y } from "@/hooks/useModalA11y";
import { Select } from "@/components/ui/Select";
import type { Role } from "@/features/accounts/accounts.types";

const schema = z.object({
  accountName: z.string().min(1, "Vui lòng nhập họ tên"),
  userName: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
});

export type AccountFormValues = z.infer<typeof schema>;

interface AccountFormModalProps {
  open: boolean;
  roles: Role[];
  loadingRoles?: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormValues) => void;
}

const emptyValues: AccountFormValues = {
  accountName: "",
  userName: "",
  password: "",
  role: "",
};

export function AccountFormModal({
  open,
  roles,
  loadingRoles = false,
  submitting,
  onClose,
  onSubmit,
}: AccountFormModalProps) {
  const panelRef = useModalA11y<HTMLDivElement>({
    open,
    onClose,
    locked: submitting,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) reset(emptyValues);
  }, [open, reset]);

  if (!open) return null;

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500";
  const labelCls =
    "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300";
  const errCls = "mt-1 min-h-[1.25rem] text-sm text-red-600 dark:text-red-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-form-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-surface-2 p-6 shadow-xl dark:ring-1 dark:ring-white/10"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="account-form-title"
            className="text-lg font-bold text-gray-900 dark:text-gray-100"
          >
            Thêm tài khoản
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className={labelCls}>Họ tên</label>
            <input
              {...register("accountName")}
              className={inputCls}
              placeholder="Nhập họ tên"
            />
            <p className={errCls}>{errors.accountName?.message ?? ""}</p>
          </div>
          <div>
            <label className={labelCls}>Tên đăng nhập</label>
            <input
              {...register("userName")}
              className={inputCls}
              placeholder="Nhập tên đăng nhập"
            />
            <p className={errCls}>{errors.userName?.message ?? ""}</p>
          </div>
          <div>
            <label className={labelCls}>Mật khẩu</label>
            <input
              {...register("password")}
              type="password"
              className={inputCls}
              placeholder="Nhập mật khẩu"
            />
            <p className={errCls}>{errors.password?.message ?? ""}</p>
          </div>
          <div>
            <label className={labelCls}>Vai trò</label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  aria-label="Chọn vai trò"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loadingRoles}
                  invalid={!!errors.role}
                  placeholder={
                    loadingRoles ? "Đang tải..." : "-- Chọn vai trò --"
                  }
                  options={roles.map((r) => ({
                    value: r.roleName,
                    label: r.roleName,
                  }))}
                />
              )}
            />
            <p className={errCls}>{errors.role?.message ?? ""}</p>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-surface-3 dark:border-app-border dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

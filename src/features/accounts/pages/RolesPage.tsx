import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlus, FiX, FiShield } from "react-icons/fi";
import { useRoles, useCreateRole } from "@/features/accounts/hooks/useAccounts";
import { useModalA11y } from "@/hooks/useModalA11y";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { StateView } from "@/components/ui/StateView";

const schema = z.object({
  roleName: z.string().min(1, "Vui lòng nhập tên vai trò"),
});
type FormData = z.infer<typeof schema>;

export default function RolesPage() {
  const { data, isLoading, isError } = useRoles();
  const createMut = useCreateRole();
  const [open, setOpen] = useState(false);

  const panelRef = useModalA11y<HTMLDivElement>({
    open,
    onClose: () => setOpen(false),
    locked: createMut.isPending,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { roleName: "" },
  });

  useEffect(() => {
    if (open) reset({ roleName: "" });
  }, [open, reset]);

  const onSubmit = (values: FormData) => {
    createMut.mutate(values, { onSuccess: () => setOpen(false) });
  };

  const roles = data ?? [];

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <div className="mb-5">
        <PageHeader
          title="Vai trò"
          subtitle={`${roles.length} vai trò`}
          action={
            <Button
              leftIcon={<FiPlus size={16} />}
              onClick={() => setOpen(true)}
            >
              Thêm
            </Button>
          }
        />
      </div>

      <StateView
        isLoading={isLoading}
        isError={isError}
        isEmpty={roles.length === 0}
        errorText="Không tải được danh sách vai trò."
        emptyText="Chưa có vai trò."
        emptyIcon={<FiShield size={30} />}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roles.map((r) => (
            <div
              key={r.idRole}
              className="flex items-center gap-3 rounded-xl border border-app-border p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                <FiShield size={18} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                {r.roleName}
              </span>
            </div>
          ))}
        </div>
      </StateView>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => !createMut.isPending && setOpen(false)}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-form-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-surface-2 p-6 shadow-xl dark:ring-1 dark:ring-white/10"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="role-form-title"
                className="text-lg font-bold text-gray-900 dark:text-gray-100"
              >
                Thêm vai trò
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label="Đóng"
              >
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên vai trò
              </label>
              <input
                {...register("roleName")}
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500"
                placeholder="Nhập tên vai trò"
              />
              <p className="mt-1.5 min-h-[1.25rem] text-sm text-red-600 dark:text-red-400">
                {errors.roleName?.message ?? ""}
              </p>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Huỷ
                </Button>
                <Button type="submit" disabled={createMut.isPending}>
                  {createMut.isPending ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

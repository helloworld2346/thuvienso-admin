import { useMemo, useState } from "react";
import { FiPlus, FiTrash2, FiSearch, FiUser } from "react-icons/fi";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useRoles,
} from "@/features/accounts/hooks/useAccounts";
import {
  AccountFormModal,
  type AccountFormValues,
} from "@/features/accounts/components/AccountFormModal";
import type { Account } from "@/features/accounts/accounts.types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PaginationBar } from "@/components/ui/PaginationBar";

export default function UsersPage() {
  const { data, isLoading, isError } = useAccounts();
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const createMut = useCreateAccount();
  const deleteMut = useDeleteAccount();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Account | null>(null);

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) =>
        a.accountName.toLowerCase().includes(q) ||
        a.userName.toLowerCase().includes(q),
    );
  }, [data, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  const handleSubmit = (values: AccountFormValues) => {
    createMut.mutate(values, { onSuccess: () => setOpen(false) });
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteMut.mutate(deleting.idAccount, {
      onSuccess: () => setDeleting(null),
    });
  };

  return (
    <div className="rounded-2xl border border-app-border bg-surface-2 p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Người dùng
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {total} tài khoản
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm tài khoản..."
              aria-label="Tìm tài khoản"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-app-border dark:bg-surface-3 dark:text-gray-100 dark:placeholder-gray-500 sm:w-64"
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <FiPlus size={16} /> Thêm
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Đang tải...
        </p>
      )}
      {isError && (
        <p className="py-12 text-center text-sm text-red-600 dark:text-red-400">
          Không tải được danh sách tài khoản.
        </p>
      )}
      {!isLoading && !isError && total === 0 && (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {search ? "Không tìm thấy tài khoản phù hợp." : "Chưa có tài khoản."}
        </p>
      )}

      {!isLoading && !isError && total > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-app-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-3 text-left text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Họ tên</th>
                  <th className="px-4 py-3 font-medium">Tên đăng nhập</th>
                  <th className="px-4 py-3 font-medium">Vai trò</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paged.map((a) => (
                  <tr
                    key={a.idAccount}
                    className="border-t border-app-border hover:bg-surface-3/50"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                        <FiUser size={15} className="text-primary" />
                        {a.accountName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {a.userName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
                        {a.roleEntity?.roleName ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleting(a)}
                        className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        aria-label="Xoá"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <PaginationBar
              page={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
            />
          </div>
        </>
      )}

      <AccountFormModal
        open={open}
        roles={roles ?? []}
        loadingRoles={loadingRoles}
        submitting={createMut.isPending}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog
        open={!!deleting}
        title="Xoá tài khoản"
        message={`Bạn có chắc muốn xoá tài khoản "${deleting?.accountName}"?`}
        loading={deleteMut.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

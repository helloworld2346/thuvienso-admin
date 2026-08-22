import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi, rolesApi } from "@/features/accounts/api/accounts.api";
import type {
  AccountPayload,
  RolePayload,
} from "@/features/accounts/accounts.types";
import { toast } from "@/store/toast.store";

const ACCOUNTS_KEY = ["accounts"] as const;
const ROLES_KEY = ["roles"] as const;

export function useAccounts() {
  return useQuery({ queryKey: ACCOUNTS_KEY, queryFn: accountsApi.getAll });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AccountPayload) => accountsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      toast.success("Thêm tài khoản thành công");
    },
    onError: () => toast.error("Thêm tài khoản thất bại"),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACCOUNTS_KEY });
      toast.success("Xoá tài khoản thành công");
    },
    onError: () => toast.error("Xoá tài khoản thất bại"),
  });
}

export function useRoles() {
  return useQuery({ queryKey: ROLES_KEY, queryFn: rolesApi.getAll });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RolePayload) => rolesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success("Thêm vai trò thành công");
    },
    onError: () => toast.error("Thêm vai trò thất bại"),
  });
}

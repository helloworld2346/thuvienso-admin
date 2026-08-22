import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  Account,
  AccountPayload,
  Role,
  RolePayload,
} from "@/features/accounts/accounts.types";
import { USE_MOCK, mockDelay } from "@/api/mock";

function read<T>(data: unknown): T {
  const d = data as { Result?: T; result?: T };
  return (d.Result ?? d.result) as T;
}

export const accountsApi = {
  getAll: async (): Promise<Account[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<Account[]>>(
      ENDPOINTS.ACCOUNTS.GET_ALL,
    );
    return read<Account[]>(data) ?? [];
  },

  create: async (payload: AccountPayload): Promise<Account> => {
    if (USE_MOCK)
      return mockDelay({
        idAccount: `mock-${Date.now()}`,
        accountName: payload.accountName,
        userName: payload.userName,
        roleEntity: null,
      });
    const { data } = await http.post<ApiResponse<Account>>(
      ENDPOINTS.ACCOUNTS.BASE,
      payload,
    );
    return read<Account>(data);
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) return mockDelay(undefined);
    await http.delete(ENDPOINTS.ACCOUNTS.BY_ID(id));
  },
};

export const rolesApi = {
  getAll: async (): Promise<Role[]> => {
    if (USE_MOCK) return mockDelay([]);
    const { data } = await http.get<ApiResponse<Role[]>>(
      ENDPOINTS.ROLES.GET_ALL,
    );
    return read<Role[]>(data) ?? [];
  },

  create: async (payload: RolePayload): Promise<Role> => {
    if (USE_MOCK)
      return mockDelay({
        idRole: `mock-${Date.now()}`,
        roleName: payload.roleName,
      });
    const { data } = await http.post<ApiResponse<Role>>(
      ENDPOINTS.ROLES.BASE,
      payload,
    );
    return read<Role>(data);
  },
};

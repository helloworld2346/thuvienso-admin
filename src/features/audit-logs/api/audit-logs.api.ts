import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { AuditLogPage } from "@/features/audit-logs/audit-logs.types";
import { USE_MOCK, mockDelay } from "@/api/mock";

const EMPTY_PAGE: AuditLogPage = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  number: 0,
  size: 20,
};

export const auditLogsApi = {
  getAll: async (page: number, size: number): Promise<AuditLogPage> => {
    if (USE_MOCK) return mockDelay(EMPTY_PAGE);
    const { data } = await http.get<ApiResponse<AuditLogPage>>(
      ENDPOINTS.AUDIT_LOGS.GET_ALL,
      { params: { page, size } },
    );
    return data.Result;
  },

  getByUser: async (
    userName: string,
    page: number,
    size: number,
  ): Promise<AuditLogPage> => {
    if (USE_MOCK) return mockDelay(EMPTY_PAGE);
    const { data } = await http.get<ApiResponse<AuditLogPage>>(
      ENDPOINTS.AUDIT_LOGS.BY_USER(userName),
      { params: { page, size } },
    );
    return data.Result;
  },
};

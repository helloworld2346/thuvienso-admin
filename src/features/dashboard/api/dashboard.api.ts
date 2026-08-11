import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  OverviewStats,
  CountByKey,
} from "@/features/dashboard/dashboard.types";
import { USE_MOCK, mock, mockDelay } from "@/api/mock";

export const dashboardApi = {
  overview: async (): Promise<OverviewStats> => {
    if (USE_MOCK) return mockDelay(mock.overview());
    const { data } = await http.get<ApiResponse<OverviewStats>>(
      ENDPOINTS.STATISTIC.OVERVIEW,
    );
    return data.Result;
  },

  documentByType: async (): Promise<CountByKey[]> => {
    if (USE_MOCK) return mockDelay(mock.documentByType());
    const { data } = await http.get<ApiResponse<CountByKey[]>>(
      ENDPOINTS.STATISTIC.DOCUMENT_BY_TYPE,
    );
    return data.Result;
  },

  topViewed: async (): Promise<CountByKey[]> => {
    if (USE_MOCK) return mockDelay(mock.topViewed());
    const { data } = await http.get<ApiResponse<CountByKey[]>>(
      ENDPOINTS.STATISTIC.TOP_VIEWED,
    );
    return data.Result;
  },
};

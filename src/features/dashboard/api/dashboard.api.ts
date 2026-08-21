import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  OverviewStats,
  CountByKey,
  MonthlyPoint,
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

  monthlyTrend: async (): Promise<MonthlyPoint[]> => {
    if (USE_MOCK) return mockDelay(mock.monthlyTrend());
    const { data } = await http.get<ApiResponse<MonthlyPoint[]>>(
      ENDPOINTS.STATISTIC.MONTHLY_TREND,
    );
    return data.Result;
  },

  documentByStatus: async (): Promise<CountByKey[]> => {
    if (USE_MOCK) return mockDelay(mock.documentByStatus());
    const { data } = await http.get<ApiResponse<CountByKey[]>>(
      ENDPOINTS.STATISTIC.DOCUMENT_BY_STATUS,
    );
    return data.Result;
  },

  topCategories: async (): Promise<CountByKey[]> => {
    if (USE_MOCK) return mockDelay(mock.topCategories());
    const { data } = await http.get<ApiResponse<CountByKey[]>>(
      ENDPOINTS.STATISTIC.TOP_CATEGORIES,
    );
    return data.Result;
  },

  usersByRole: async (): Promise<CountByKey[]> => {
    if (USE_MOCK) return mockDelay(mock.usersByRole());
    const { data } = await http.get<ApiResponse<CountByKey[]>>(
      ENDPOINTS.STATISTIC.USERS_BY_ROLE,
    );
    return data.Result;
  },

  weeklyActivity: async (): Promise<CountByKey[]> => {
    if (USE_MOCK) return mockDelay(mock.weeklyActivity());
    const { data } = await http.get<ApiResponse<CountByKey[]>>(
      ENDPOINTS.STATISTIC.WEEKLY_ACTIVITY,
    );
    return data.Result;
  },
};

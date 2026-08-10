import { http } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  ApiResult,
  OverviewStats,
  CountByKey,
} from "@/features/dashboard/dashboard.types";

export const dashboardApi = {
  overview: async (): Promise<OverviewStats> => {
    const { data } = await http.get<ApiResult<OverviewStats>>(
      ENDPOINTS.STATISTIC.OVERVIEW,
    );
    return data.Result;
  },

  documentByType: async (): Promise<CountByKey[]> => {
    const { data } = await http.get<ApiResult<CountByKey[]>>(
      ENDPOINTS.STATISTIC.DOCUMENT_BY_TYPE,
    );
    return data.Result;
  },

  topViewed: async (): Promise<CountByKey[]> => {
    const { data } = await http.get<ApiResult<CountByKey[]>>(
      ENDPOINTS.STATISTIC.TOP_VIEWED,
    );
    return data.Result;
  },
};

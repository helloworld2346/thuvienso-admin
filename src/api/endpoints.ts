export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  STATISTIC: {
    OVERVIEW: "/statistic/overview",
    DOCUMENT_BY_TYPE: "/statistic/documentByType",
    TOP_VIEWED: "/statistic/topViewed",
  },
  CATEGORIES: {
    GET_ALL: "/categories/getAll",
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
  },
} as const;

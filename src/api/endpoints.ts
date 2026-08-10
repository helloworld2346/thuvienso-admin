export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    INTROSPECT: "/auth/introspect",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  STATISTIC: {
    OVERVIEW: "/statistic/overview",
    DOCUMENT_BY_TYPE: "/statistic/documentByType",
    TOP_VIEWED: "/statistic/topViewed",
  },
} as const;

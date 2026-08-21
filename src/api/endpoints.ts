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
    MONTHLY_TREND: "/statistic/monthlyTrend",
    DOCUMENT_BY_STATUS: "/statistic/documentByStatus",
    TOP_CATEGORIES: "/statistic/topCategories",
  },
  CATEGORIES: {
    GET_ALL: "/categories/getAll",
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
  },
  BOOKS: {
    GET_ALL: "/books/getAll",
    BASE: "/books",
    UPLOAD: "/books",
    BY_ID: (id: string) => `/books/${id}`,
  },
  DOCUMENTS: {
    GET_ALL: "/documents/getAll",
    BASE: "/documents",
    BY_ID: (id: string) => `/documents/${id}`,
  },
  FILES: {
    BY_DOCUMENT: (idDocument: string) => `/files/document/${idDocument}`,
  },
} as const;

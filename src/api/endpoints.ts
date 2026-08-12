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
  BOOKS: {
    GET_ALL: "/books/getAll",
    BASE: "/books",
    UPLOAD: "/books",
    BY_ID: (id: string) => `/books/${id}`,
  },
  FILES: {
    BY_DOCUMENT: (idDocument: string) => `/files/document/${idDocument}`,
  },
} as const;

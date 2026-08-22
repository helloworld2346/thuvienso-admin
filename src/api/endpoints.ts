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
    USERS_BY_ROLE: "/statistic/usersByRole",
    WEEKLY_ACTIVITY: "/statistic/weeklyActivity",
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
    AUDIO: (id: string) => `/books/${id}/audio`,
  },
  DOCUMENTS: {
    GET_ALL: "/documents/getAll",
    BASE: "/documents",
    BY_ID: (id: string) => `/documents/${id}`,
  },
  FOLDERS: {
    BASE: "/folder",
    BY_ID: (id: string) => `/folder/${id}`,
    RESTORE: (id: string) => `/folder/restore/${id}`,
    LEVEL1: "/folder/level1",
    CHILDREN: (id: string) => `/folder/getChildFolder/${id}`,
    TREE: (id: string) => `/folder/allTree/${id}`,
    DELETED: "/folder/deleted",
  },
  FILES: {
    BY_DOCUMENT: (idDocument: string) => `/files/document/${idDocument}`,
  },
} as const;

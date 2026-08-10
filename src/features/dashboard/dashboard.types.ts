export interface ApiResult<T> {
  success: boolean;
  code: number;
  message: string;
  Result: T;
}

export interface OverviewStats {
  totalDocuments: number;
  totalBooks: number;
  totalAccounts: number;
  totalBorrows: number;
  totalViews: number;
  totalDownloads: number;
}

export interface CountByKey {
  key: string;
  count: number;
}

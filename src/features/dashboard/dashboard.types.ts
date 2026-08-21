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

export interface MonthlyPoint {
  month: string;
  views: number;
  downloads: number;
  borrows: number;
}

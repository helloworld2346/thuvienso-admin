import type { ApiResponse } from "@/types/api";
import type { LoginResult } from "@/features/auth/auth.types";
import type { Category } from "@/features/categories/categories.types";
import type { Book, FileResponse } from "@/features/books/books.types";
import type { Document } from "@/features/documents/documents.types";

import type {
  OverviewStats,
  CountByKey,
  MonthlyPoint,
} from "@/features/dashboard/dashboard.types";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export function mockDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function makeMockJwt(): string {
  const enc = (obj: unknown) => btoa(JSON.stringify(obj)).replace(/=+$/, "");
  const header = enc({ alg: "HS512", typ: "JWT" });
  const payload = enc({
    sub: "mock-user-id",
    scope: "ROLE_Admin",
    userName: "admin",
    iss: "",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
  });
  return `${header}.${payload}.mock-signature`;
}

export const mock = {
  login: (): LoginResult => ({ authenticated: true, token: makeMockJwt() }),

  categories: (): Category[] =>
    Array.from({ length: 23 }, (_, i) => ({
      idCategory: `mock-cat-${i + 1}`,
      categoryName: `Danh mục mẫu ${i + 1}`,
    })),

  overview: (): OverviewStats => ({
    totalDocuments: 128,
    totalBooks: 342,
    totalAccounts: 57,
    totalBorrows: 89,
    totalViews: 12045,
    totalDownloads: 3120,
  }),

  documentByType: (): CountByKey[] => [
    { key: "PDF", count: 84 },
    { key: "DOCX", count: 22 },
    { key: "MP4", count: 14 },
    { key: "PNG", count: 8 },
    { key: "PPTX", count: 11 },
    { key: "XLSX", count: 6 },
    { key: "MP3", count: 5 },
  ],

  topViewed: (): CountByKey[] => [
    { key: "Điều lệnh quản lý bộ đội", count: 1204 },
    { key: "Giáo trình chiến thuật", count: 980 },
    { key: "Lịch sử Sư Đoàn 5", count: 765 },
    { key: "Kỹ thuật bộ binh", count: 642 },
    { key: "Công tác hậu cần", count: 531 },
    { key: "Chính trị viên", count: 418 },
  ],
  monthlyTrend: (): MonthlyPoint[] => [
    { month: "Tháng 1", views: 820, downloads: 210, borrows: 45 },
    { month: "Tháng 2", views: 932, downloads: 245, borrows: 52 },
    { month: "Tháng 3", views: 1010, downloads: 280, borrows: 61 },
    { month: "Tháng 4", views: 1180, downloads: 305, borrows: 58 },
    { month: "Tháng 5", views: 1290, downloads: 340, borrows: 70 },
    { month: "Tháng 6", views: 1120, downloads: 300, borrows: 66 },
    { month: "Tháng 7", views: 1350, downloads: 372, borrows: 81 },
    { month: "Tháng 8", views: 1480, downloads: 410, borrows: 88 },
    { month: "Tháng 9", views: 1390, downloads: 395, borrows: 79 },
    { month: "Tháng 10", views: 1560, downloads: 430, borrows: 92 },
    { month: "Tháng 11", views: 1620, downloads: 455, borrows: 97 },
    { month: "Tháng 12", views: 1710, downloads: 480, borrows: 104 },
  ],

  documentByStatus: (): CountByKey[] => [
    { key: "Đã duyệt", count: 96 },
    { key: "Chờ duyệt", count: 24 },
    { key: "Từ chối", count: 8 },
  ],

  topCategories: (): CountByKey[] => [
    { key: "Chiến thuật", count: 42 },
    { key: "Điều lệnh", count: 35 },
    { key: "Lịch sử", count: 28 },
    { key: "Hậu cần", count: 21 },
    { key: "Kỹ thuật", count: 18 },
    { key: "Chính trị", count: 15 },
  ],
  usersByRole: (): CountByKey[] => [
    { key: "Bạn đọc", count: 48 },
    { key: "Thủ thư", count: 6 },
    { key: "Quản trị", count: 3 },
  ],

  weeklyActivity: (): CountByKey[] => [
    { key: "T2", count: 320 },
    { key: "T3", count: 410 },
    { key: "T4", count: 388 },
    { key: "T5", count: 452 },
    { key: "T6", count: 505 },
    { key: "T7", count: 610 },
    { key: "CN", count: 540 },
  ],
  books: (): Book[] =>
    Array.from({ length: 30 }, (_, i) => ({
      idBook: `mock-book-${i + 1}`,
      bookCode: `QS-${String(i + 1).padStart(3, "0")}`,
      title: `Sách mẫu ${i + 1}`,
      author: "Tác giả mẫu",
      publisher: "NXB Quân đội Nhân dân",
      publishYear: 2020 + (i % 5),
      shelfLocation: `A${(i % 9) + 1}-0${(i % 5) + 1}`,
      totalCopies: 10,
      availableCopies: 10 - (i % 4),
      thumbnail: "",
      document: {
        idDocument: `mock-doc-${i + 1}`,
        content: "",
        title: `Sách mẫu ${i + 1}`,
        status: "Approved",
        typeDocument: "BOOK",
        thumbnail: "",
      },
    })),

  files: (): FileResponse[] => [
    {
      idFile: "mock-file-1",
      fileName: "sach-mau.pdf",
      partFile: "documents/mock-doc-1/sach-mau.pdf",
      typeFile: "PDF",
      thumbnail: "",
    },
  ],
  documents: (): Document[] =>
    Array.from({ length: 20 }, (_, i) => ({
      idDocument: `mock-doc-${i + 1}`,
      title: `Tài liệu mẫu ${i + 1}`,
      content: "Mô tả ngắn cho tài liệu mẫu.",
      status: (["Pending", "Approve", "Refuse"] as const)[i % 3],
      typeDocument: (["ARTICLE", "DOCUMENT", "PDF", "VIDEO", "BOOK"] as const)[
        i % 5
      ],
      thumbnail: "",
    })),
};

export function wrap<T>(result: T): ApiResponse<T> {
  return { success: true, code: 0, message: "mock", Result: result };
}

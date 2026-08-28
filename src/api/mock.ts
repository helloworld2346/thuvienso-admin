import type { ApiResponse } from "@/types/api";
import type { LoginResult } from "@/features/auth/auth.types";
import type { Category } from "@/features/categories/categories.types";
import type { Book } from "@/features/books/books.types";
import type { FileResponse } from "@/features/files/files.types";
import type { Document } from "@/features/documents/documents.types";

import type {
  OverviewStats,
  CountByKey,
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
    { key: "PDF", value: 84 },
    { key: "DOCX", value: 22 },
    { key: "MP4", value: 14 },
    { key: "PNG", value: 8 },
    { key: "PPTX", value: 11 },
    { key: "XLSX", value: 6 },
    { key: "MP3", value: 5 },
  ],

  topViewed: (): CountByKey[] => [
    { key: "Điều lệnh quản lý bộ đội", value: 1204 },
    { key: "Giáo trình chiến thuật", value: 980 },
    { key: "Lịch sử Sư Đoàn 5", value: 765 },
    { key: "Kỹ thuật bộ binh", value: 642 },
    { key: "Công tác hậu cần", value: 531 },
    { key: "Chính trị viên", value: 418 },
  ],

  monthlyTrend: (): CountByKey[] => [
    { key: "Tháng 1", value: 820 },
    { key: "Tháng 2", value: 932 },
    { key: "Tháng 3", value: 1010 },
    { key: "Tháng 4", value: 1180 },
    { key: "Tháng 5", value: 1290 },
    { key: "Tháng 6", value: 1120 },
    { key: "Tháng 7", value: 1350 },
    { key: "Tháng 8", value: 1480 },
    { key: "Tháng 9", value: 1390 },
    { key: "Tháng 10", value: 1560 },
    { key: "Tháng 11", value: 1620 },
    { key: "Tháng 12", value: 1710 },
  ],

  documentByStatus: (): CountByKey[] => [
    { key: "Đã duyệt", value: 96 },
    { key: "Chờ duyệt", value: 24 },
    { key: "Từ chối", value: 8 },
  ],

  topCategories: (): CountByKey[] => [
    { key: "Chiến thuật", value: 42 },
    { key: "Điều lệnh", value: 35 },
    { key: "Lịch sử", value: 28 },
    { key: "Hậu cần", value: 21 },
    { key: "Kỹ thuật", value: 18 },
    { key: "Chính trị", value: 15 },
  ],

  usersByRole: (): CountByKey[] => [
    { key: "Bạn đọc", value: 48 },
    { key: "Thủ thư", value: 6 },
    { key: "Quản trị", value: 3 },
  ],

  weeklyActivity: (): CountByKey[] => [
    { key: "T2", value: 320 },
    { key: "T3", value: 410 },
    { key: "T4", value: 388 },
    { key: "T5", value: 452 },
    { key: "T6", value: 505 },
    { key: "T7", value: 610 },
    { key: "CN", value: 540 },
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

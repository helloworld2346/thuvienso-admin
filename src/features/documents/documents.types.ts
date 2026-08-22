export const DOCUMENT_TYPES = [
  "ARTICLE",
  "DOCUMENT",
  "PDF",
  "VIDEO",
  "IMAGE",
  "LESSON",
  "LECTURE",
  "SCAN",
  "AUDIO",
  "BOOK",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_STATUSES = ["Pending", "Approve", "Refuse"] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  ARTICLE: "Bài viết",
  DOCUMENT: "Tài liệu",
  PDF: "PDF",
  VIDEO: "Video",
  IMAGE: "Hình ảnh",
  LESSON: "Bài học",
  LECTURE: "Bài giảng",
  SCAN: "Bản scan",
  AUDIO: "Âm thanh",
  BOOK: "Sách",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  Pending: "Chờ duyệt",
  Approve: "Đã duyệt",
  Refuse: "Từ chối",
};

export interface Document {
  idDocument: string;
  title: string;
  content: string;
  status: DocumentStatus;
  typeDocument: DocumentType;
  thumbnail: string;
}

export interface DocumentPayload {
  title: string;
  content: string;
  typeDocument: DocumentType;
  status: DocumentStatus;
  thumbnail?: string;
  categoryEntity?: string;
  folderEntity?: string;
}

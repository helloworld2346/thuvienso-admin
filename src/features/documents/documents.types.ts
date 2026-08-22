export const DOCUMENT_TYPES = ["ARTICLE", "BOOK", "REPORT", "OTHER"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_STATUSES = ["Pending", "Approved", "Rejected"] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

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

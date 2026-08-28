import type {
  DocumentType,
  DocumentStatus,
} from "@/features/documents/documents.types";
import type { Category } from "@/features/categories/categories.types";

export interface News {
  idNews: string;
  title: string;
  content: string;
  thumbnail: string;
  status: DocumentStatus;
  typeDocument: DocumentType;
  categoryEntity?: Category;
  viewCount: number;
}

export interface NewsPayload {
  title: string;
  content: string;
  categoryEntity: string;
  status: DocumentStatus;
}

export interface NewsPage {
  content: News[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

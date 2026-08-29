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
  summary?: string;
  slug?: string;
  status: DocumentStatus;
  typeDocument: DocumentType;
  categoryEntity?: Category;
  viewCount: number;
  publishedAt?: string;
}

export interface NewsPayload {
  title: string;
  content: string;
  summary?: string;
  slug?: string;
  publishedAt?: string;
  categoryEntity: string;
  status: DocumentStatus;
  thumbnail?: string;
}

export interface NewsPage {
  content: News[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

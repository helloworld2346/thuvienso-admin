export interface BookDocument {
  idDocument: string;
  content: string;
  title: string;
  status: string;
  typeDocument: string;
  thumbnail: string;
}

export interface BookCategory {
  idCategory: string;
  categoryName: string;
}

export interface Book {
  idBook: string;
  bookCode: string;
  title: string;
  author: string;
  description?: string;
  publisher: string;
  publishYear: number;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  categoryEntity?: BookCategory;
  thumbnail: string;
  qrCode?: string;
  document?: BookDocument;
}

export interface BookPayload {
  bookCode: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  shelfLocation: string;
  totalCopies: number;
  categoryEntity: string;
}

export interface BookCreateInput extends BookPayload {
  file: File;
  cover?: File | null;
}

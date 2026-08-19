export interface BookDocument {
  idDocument: string;
  content: string;
  title: string;
  status: string;
  typeDocument: string;
  thumbnail: string;
}

export interface Book {
  idBook: string;
  bookCode: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  shelfLocation: string;
  totalCopies: number;
  availableCopies: number;
  thumbnail: string;
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
  cover: File;
}

export interface FileResponse {
  idFile: string;
  fileName: string;
  partFile: string;
  typeFile: "PDF" | "MP4" | "MP3" | "PNG" | "JPG" | "DOCX" | "ZIP";
  thumbnail: string;
}

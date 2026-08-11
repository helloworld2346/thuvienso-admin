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
}

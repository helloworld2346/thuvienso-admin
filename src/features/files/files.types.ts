export interface FileResponse {
  idFile: string;
  fileName: string;
  partFile: string;
  typeFile:
    | "PDF"
    | "MP4"
    | "MP3"
    | "PNG"
    | "JPG"
    | "DOC"
    | "DOCX"
    | "XLS"
    | "XLSX"
    | "PPT"
    | "PPTX"
    | "ZIP";
  thumbnail: string;
  size?: number;
  createdAt?: string;
  deletedAt?: string;
  expireAt?: string;
}

export interface CopyFileRequest {
  files: string[];
}

export interface CutFileRequest {
  files: string[];
}

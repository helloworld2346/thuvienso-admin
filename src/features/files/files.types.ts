export interface FileResponse {  
  idFile: string;  
  fileName: string;  
  partFile: string;  
  typeFile: "PDF" | "MP4" | "MP3" | "PNG" | "JPG" | "DOCX" | "ZIP";  
  thumbnail: string;  
  size?: number;  
  createdAt?: string;  
}  
  
export interface CopyFileRequest {  
  files: string[];  
}  
  
export interface CutFileRequest {  
  files: string[];  
}  

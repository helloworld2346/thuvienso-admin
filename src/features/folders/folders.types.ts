export interface Folder {
  idFolder: string;
  folderName: string;
  description?: string;
}

export interface FolderDetail extends Folder {
  parentFolder?: Folder | null;
  childFolder?: Folder[];
  documentEntity?: unknown[];
}

export interface FolderCreatePayload {
  folderName: string;
  description?: string;
  parentFolder?: string;
}

export interface FolderUpdatePayload {
  folderName: string;
}

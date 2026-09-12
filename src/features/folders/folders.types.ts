export interface Folder {
  idFolder: string;
  folderName: string;
  description?: string;
  itemCount?: number;
  updatedAt?: string;
  size?: number;
  deletedAt?: string;
  expireAt?: string;
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
  visibility?: boolean;
}

export interface FolderUpdatePayload {
  folderName: string;
}

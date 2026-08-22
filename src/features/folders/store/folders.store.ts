import { create } from "zustand";
import type { Folder } from "@/features/folders/folders.types";
import type { Document } from "@/features/documents/documents.types";

export type ClipboardMode = "copy" | "cut";

export interface ClipboardEntry {
  mode: ClipboardMode;
  kind: "folder" | "document";
  folder?: Folder;
  document?: Document;
}

interface FoldersUIState {
  clipboard: ClipboardEntry | null;
  copyFolder: (folder: Folder) => void;
  cutFolder: (folder: Folder) => void;
  copyDocument: (document: Document) => void;
  cutDocument: (document: Document) => void;
  clearClipboard: () => void;
}

export const useFoldersStore = create<FoldersUIState>((set) => ({
  clipboard: null,
  copyFolder: (folder) =>
    set({ clipboard: { mode: "copy", kind: "folder", folder } }),
  cutFolder: (folder) =>
    set({ clipboard: { mode: "cut", kind: "folder", folder } }),
  copyDocument: (document) =>
    set({ clipboard: { mode: "copy", kind: "document", document } }),
  cutDocument: (document) =>
    set({ clipboard: { mode: "cut", kind: "document", document } }),
  clearClipboard: () => set({ clipboard: null }),
}));

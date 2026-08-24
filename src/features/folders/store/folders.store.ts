import { create } from "zustand";
import type { Folder } from "@/features/folders/folders.types";
import type { Document } from "@/features/documents/documents.types";
import { toast } from "@/store/toast.store";

export type ClipboardMode = "copy" | "cut";

export interface ClipboardEntry {
  kind: "folder" | "document";
  folder?: Folder;
  document?: Document;
}

export interface Clipboard {
  mode: ClipboardMode;
  entries: ClipboardEntry[];
}

export interface MarkedFolder {
  folder: Folder;
  parentId: string | null;
}

export type ViewMode = "grid" | "list";  


interface FoldersUIState {
  clipboard: Clipboard | null;
  marked: MarkedFolder[];
  toggleMark: (folder: Folder, ancestorIds: string[]) => void;
  clearMarks: () => void;
  copyFolder: (folder: Folder) => void;
  cutFolder: (folder: Folder) => void;
  copyDocument: (document: Document) => void;
  cutDocument: (document: Document) => void;
  clearClipboard: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

function parentOf(ancestorIds: string[]): string | null {
  return ancestorIds.length > 0 ? ancestorIds[ancestorIds.length - 1] : null;
}

function toEntries(folders: Folder[]): ClipboardEntry[] {
  return folders.map((folder) => ({ kind: "folder" as const, folder }));
}

function pickFolders(marked: MarkedFolder[], folder: Folder): Folder[] {
  const inMarks = marked.some((m) => m.folder.idFolder === folder.idFolder);
  if (inMarks && marked.length > 0) return marked.map((m) => m.folder);
  return [folder];
}

export const useFoldersStore = create<FoldersUIState>((set, get) => ({
  clipboard: null,
  marked: [],
  toggleMark: (folder, ancestorIds) =>
    set((s) => {
      const exists = s.marked.some(
        (m) => m.folder.idFolder === folder.idFolder,
      );
      if (exists) {
        return {
          marked: s.marked.filter((m) => m.folder.idFolder !== folder.idFolder),
        };
      }

      const parentId = parentOf(ancestorIds);
      const currentScope = s.marked.length > 0 ? s.marked[0].parentId : null;

      if (s.marked.length > 0 && currentScope !== parentId) {
        toast.info("Chỉ chọn được nhiều thư mục trong cùng một thư mục cha.");
        return { marked: [{ folder, parentId }] };
      }

      return { marked: [...s.marked, { folder, parentId }] };
    }),
  clearMarks: () => set({ marked: [] }),
  copyFolder: (folder) => {
    const picked = pickFolders(get().marked, folder);
    set({ clipboard: { mode: "copy", entries: toEntries(picked) } });
  },
  cutFolder: (folder) => {
    const picked = pickFolders(get().marked, folder);
    set({ clipboard: { mode: "cut", entries: toEntries(picked) } });
  },
  copyDocument: (document) =>
    set({
      clipboard: { mode: "copy", entries: [{ kind: "document", document }] },
    }),
  cutDocument: (document) =>
    set({
      clipboard: { mode: "cut", entries: [{ kind: "document", document }] },
    }),
  clearClipboard: () => set({ clipboard: null }),
  viewMode: "grid",
  setViewMode: (viewMode) => set({ viewMode }),
}));

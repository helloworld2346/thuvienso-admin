import { useFoldersStore } from "@/features/folders/store/folders.store";
import {
  useCopyFolder,
  useMoveFolder,
} from "@/features/folders/hooks/useFolders";
import { useMoveDocument } from "@/features/documents/hooks/useDocuments";
import {
  useCopyFilesToFolder,
  useMoveFilesToFolder,
} from "@/features/files/hooks/useFiles";
import {
  FOLDER_MOVE_ENABLED,
  FOLDER_COPY_ENABLED,
} from "@/features/folders/folders.config";
import type { Folder } from "@/features/folders/folders.types";

export function useFolderClipboard() {
  const {
    clipboard,
    clearClipboard,
    clearMarks,
    copyFolder,
    cutFolder,
    copyFile,
    cutFile,
  } = useFoldersStore();

  const copyFolderMut = useCopyFolder();
  const moveFolderMut = useMoveFolder();
  const moveDocMut = useMoveDocument();
  const copyFilesMut = useCopyFilesToFolder();
  const moveFilesMut = useMoveFilesToFolder();

  const pasteInto = (target: Folder) => {
    if (!clipboard || clipboard.entries.length === 0) return;

    const fileIds = clipboard.entries
      .filter((e) => e.kind === "file" && e.file)
      .map((e) => e.file!.idFile);

    if (clipboard.mode === "copy") {
      clipboard.entries.forEach((entry) => {
        if (entry.kind === "folder" && entry.folder && FOLDER_COPY_ENABLED) {
          copyFolderMut.mutate({
            id: entry.folder.idFolder,
            parentFolder: target.idFolder,
          });
        }
      });
      if (fileIds.length > 0)
        copyFilesMut.mutate({ idFolder: target.idFolder, fileIds });
      clearClipboard();
      clearMarks();
      return;
    }

    clipboard.entries.forEach((entry) => {
      if (entry.kind === "folder" && entry.folder && FOLDER_MOVE_ENABLED) {
        moveFolderMut.mutate({
          id: entry.folder.idFolder,
          parentFolder: target.idFolder,
        });
      } else if (entry.kind === "document" && entry.document) {
        moveDocMut.mutate({
          id: entry.document.idDocument,
          folderEntity: target.idFolder,
        });
      }
    });
    if (fileIds.length > 0)
      moveFilesMut.mutate({ idFolder: target.idFolder, fileIds });
    clearClipboard();
    clearMarks();
  };

  return { clipboard, pasteInto, copyFolder, cutFolder, copyFile, cutFile };
}

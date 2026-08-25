import { useState } from "react";
import type { Folder } from "@/features/folders/folders.types";

export function useFolderNavigation() {
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [trail, setTrail] = useState<Folder[]>([]);

  const openFolder = (f: Folder) => {
    setTrail((t) => {
      const idx = t.findIndex((x) => x.idFolder === f.idFolder);
      return idx >= 0 ? t.slice(0, idx + 1) : [...t, f];
    });
    setCurrentFolder(f);
  };

  const goCrumb = (f: Folder | null) => {
    if (!f) {
      setTrail([]);
      setCurrentFolder(null);
      return;
    }
    const idx = trail.findIndex((t) => t.idFolder === f.idFolder);
    setTrail(trail.slice(0, idx + 1));
    setCurrentFolder(f);
  };

  return { currentFolder, trail, openFolder, goCrumb };
}

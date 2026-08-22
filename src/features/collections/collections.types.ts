export const COLLECTION_TYPES = [
  "FEATURED",
  "TODAY",
  "THIS_WEEK",
  "THIS_MONTH",
  "VIDEO_HOT",
  "NEWEST",
] as const;
export type CollectionType = (typeof COLLECTION_TYPES)[number];

export const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
  FEATURED: "Nổi bật",
  TODAY: "Hôm nay",
  THIS_WEEK: "Tuần này",
  THIS_MONTH: "Tháng này",
  VIDEO_HOT: "Video hot",
  NEWEST: "Mới nhất",
};

export interface Collection {
  idCollection: string;
  collectionName: string;
  typeCollection: CollectionType;
}

export interface CollectionPayload {
  collectionName: string;
  typeCollection: CollectionType;
}

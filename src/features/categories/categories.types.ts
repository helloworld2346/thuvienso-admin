export interface Category {
  idCategory: string;
  categoryName: string;
  parentCategory?: Category | null;
  childCategory?: Category[];
  isDisplay?: boolean;
}

export interface CategoryCreatePayload {
  categoryName: string;
  parentCategory?: string;
  isDisplay: boolean;
}

export interface CategoryUpdatePayload {
  categoryName: string;
}

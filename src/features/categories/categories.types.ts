export interface Category {
  idCategory: string;
  categoryName: string;
  childCategory?: string[];
}

export interface CategoryCreatePayload {
  categoryName: string;
  parentCategory?: string;
  isDisplay: boolean;
}

export interface CategoryUpdatePayload {
  categoryName: string;
}

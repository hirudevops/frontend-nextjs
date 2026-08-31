import { getJSON } from "./api";

export type CatalogProduct = {
  id: string;
  category_id?: string;
  sku: string;
  name: string;
  slug: string;
  image_url?: string;
  price_cents: number;
  currency: string;
  qty: number;
};

export type CatalogListResponse = {
  items: CatalogProduct[];
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogCategoriesResponse = {
  items: CatalogCategory[];
};

export async function listProducts(limit = 20, offset = 0): Promise<CatalogListResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return getJSON<CatalogListResponse>(`/catalog/products?${params.toString()}`);
}

export async function listCategories(): Promise<CatalogCategoriesResponse> {
  return getJSON<CatalogCategoriesResponse>("/catalog/categories");
}

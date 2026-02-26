import type { FetchProductsParams, ProductsListResponse } from "@/types";
import { API_BASE } from "./config";

const PRODUCTS_BASE = `${API_BASE}/products`;

/** Загрузка списка товаров. */
export async function fetchProducts(
  params: FetchProductsParams = {},
): Promise<ProductsListResponse> {
  const { limit = 5, skip = 0, sortBy, order, signal } = params;
  const search = new URLSearchParams();
  search.set("limit", String(limit));
  search.set("skip", String(skip));

  if (sortBy) search.set("sortBy", sortBy);
  if (order) search.set("order", order);

  const url = `${PRODUCTS_BASE}?${search.toString()}`;
  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error("Не удалось загрузить товары");

  return res.json() as Promise<ProductsListResponse>;
}

/** Поиск товаров. */
export async function searchProducts(
  /**
   * Поисковый запрос.
   * @default ""
   */
  queryStr: string = "",
  /** Сигнал отмены запроса. */
  signal?: AbortSignal,
  /** Количество результатов на странице.
   *  @default 5
   */
  limit: number = 5,
  /** Смещение для пагинации.
   * @default 0
   */
  skip: number = 0,
): Promise<ProductsListResponse> {
  if (!queryStr.trim()) return fetchProducts({ limit, skip, signal });

  const params = new URLSearchParams({
    q: queryStr.trim(),
    limit: String(limit),
    skip: String(skip),
  });

  const res = await fetch(`${PRODUCTS_BASE}/search?${params.toString()}`, {
    signal,
  });

  if (!res.ok) throw new Error("Ошибка поиска");

  return res.json() as Promise<ProductsListResponse>;
}

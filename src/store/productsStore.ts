import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchProducts, searchProducts } from "@/api/productsApi";
import type {
  AddProductFormData,
  Product,
  ProductSortField,
  ProductsState,
} from "@/types";

/** Количество товаров на странице. */
const LIMIT = 5;

/** Ключ для persist. */
const PERSIST_KEY = "products-persist";

/** Сохраняем в sessionStorage только page и searchQuery (остальное — только в памяти). */
const productsPersist = {
  name: PERSIST_KEY,
  storage: createJSONStorage<
    Partial<Pick<ProductsState, "page" | "searchQuery">>
  >(() => sessionStorage),
  partialize: (state: ProductsState) => ({
    page: state.page,
    searchQuery: state.searchQuery,
  }),
};

/** Состояние и действия стора товаров (Zustand). */
export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      page: 1,
      limit: LIMIT,
      loading: false,
      error: null,
      sortBy: null,
      order: "asc",
      searchQuery: "",
      selectedIds: new Set(),
      localProducts: [],
      lastLocalId: 0,

      setLoading(loading) {
        set({ loading });
      },

      setError(error) {
        set({ error });
      },

      async loadProducts(signal?: AbortSignal) {
        const { page, limit, sortBy, order, searchQuery } = get();
        set({ loading: true, error: null });

        try {
          if (searchQuery.trim()) {
            const skip = (page - 1) * limit;
            const res = await searchProducts(searchQuery, signal, limit, skip);
            if (signal?.aborted) return;

            set({
              items: res.products,
              total: res.total,
              loading: false,
              error: null,
            });
          } else {
            const res = await fetchProducts({
              limit,
              skip: (page - 1) * limit,
              sortBy: sortBy ?? undefined,
              order,
              signal,
            });
            if (signal?.aborted) return;

            set({
              items: res.products,
              total: res.total,
              loading: false,
              error: null,
            });
          }
        } catch (e) {
          if (signal?.aborted) return;

          set({
            loading: false,
            error: e instanceof Error ? e.message : "Ошибка загрузки",
          });
        }
      },

      setPage(page) {
        set({ page });
      },

      setSort(field: ProductSortField) {
        const { sortBy, order } = get();
        const newOrder: "asc" | "desc" =
          sortBy === field && order === "asc" ? "desc" : "asc";
        set({ sortBy: field, order: newOrder, page: 1 });
      },

      setSearchQuery(searchQuery) {
        const current = get().searchQuery;
        if (current === searchQuery) return;
        set({ searchQuery, page: 1 });
      },

      toggleSelect(id: number) {
        const { selectedIds } = get();
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set({ selectedIds: next });
      },

      toggleSelectAll(currentPageIds: number[]) {
        const { selectedIds } = get();
        const allCurrentSelected =
          currentPageIds.length > 0 &&
          currentPageIds.every((id) => selectedIds.has(id));
        const next = new Set(selectedIds);

        if (allCurrentSelected) {
          currentPageIds.forEach((id) => next.delete(id));
        } else {
          currentPageIds.forEach((id) => next.add(id));
        }

        set({ selectedIds: next });
      },

      clearSelection() {
        set({ selectedIds: new Set() });
      },

      addLocalProduct(data: AddProductFormData): Product {
        const { lastLocalId, localProducts } = get();
        const id = lastLocalId - 1;
        const product: Product = {
          id,
          title: data.title,
          price: data.price,
          brand: data.brand,
          sku: data.sku,
          category: "",
          rating: 0,
        };

        set({
          lastLocalId: id,
          localProducts: [product, ...localProducts],
        });
        return product;
      },

      resetProductsPersisted() {
        set({ page: 1, searchQuery: "" });
      },
    }),
    productsPersist,
  ),
);

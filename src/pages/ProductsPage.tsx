import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProductsStore } from "@/store/productsStore";
import styles from "./ProductsPage.module.css";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/Button";
import { ProductsTable } from "@/components/ProductsTable";
import { AddProductModal } from "@/components/AddProductModal";
import { Toast } from "@/components/Toast";
import type { ProductSortField } from "@/types";

export const ProductsPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const {
    items,
    total,
    page,
    limit,
    loading,
    error,
    sortBy,
    order,
    searchQuery,
    selectedIds,
    localProducts,
    loadProducts,
    setPage,
    setSort,
    setSearchQuery,
    setError,
    toggleSelect,
    toggleSelectAll,
    addLocalProduct,
  } = useProductsStore();

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 350);

  const displayItems = useMemo(
    () =>
      page === 1 && !debouncedSearch ? [...localProducts, ...items] : items,
    [page, debouncedSearch, localProducts, items],
  );

  const displayTotal = useMemo(
    () => (debouncedSearch ? total : total + localProducts.length),
    [debouncedSearch, total, localProducts.length],
  );

  const handleAddClick = () => setModalOpen(true);

  const handleCloseModal = () => setModalOpen(false);

  const handleCloseToast = () => setToast(null);

  const handleSort = (field: ProductSortField) => {
    setSort(field);
  };

  const handleSearchChange = (q: string) => {
    setSearchInput(q);
    setSearchQuery(q);
  };

  const handleAddProduct = (data: Parameters<typeof addLocalProduct>[0]) => {
    addLocalProduct(data);
    setToast("Товар успешно добавлен");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRefresh = useCallback(() => {
    setSearchQuery("");
    setPage(1);

    if (page === 1) loadProducts();
  }, [page, loadProducts, setPage, setSearchQuery]);

  // Синхронизируем строку поиска с состоянием стора.
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Делаем запрос с задержкой.
  useEffect(() => {
    useProductsStore.getState().setSearchQuery(debouncedSearch);
  }, [debouncedSearch]);

  // Загружаем товары.
  useEffect(() => {
    const controller = new AbortController(); // Контроллер для отмены запроса при размонтировании.
    loadProducts(controller.signal);

    return () => controller.abort();
  }, [page, sortBy, order, debouncedSearch, loadProducts]);

  return (
    <>
      <div className={styles.layout}>
        <main
          id="main-content"
          className={styles.main}
          aria-label="Список товаров"
        >
          {error && (
            <div className={styles.loadError} role="alert">
              <span>{error}</span>
              <button
                type="button"
                className={styles.loadErrorClose}
                onClick={() => setError(null)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
          )}

          <ProductsTable
            headerRight={
              <Button type="button" variant="ghost" onClick={handleLogout}>
                Выйти
              </Button>
            }
            products={displayItems}
            total={displayTotal}
            page={page}
            limit={limit}
            loading={loading}
            searchQuery={searchInput}
            sortBy={sortBy}
            order={order}
            selectedIds={selectedIds}
            onSort={handleSort}
            onSearchChange={handleSearchChange}
            onPageChange={setPage}
            onRefresh={handleRefresh}
            onAddClick={handleAddClick}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={(ids) => toggleSelectAll(ids)}
          />
        </main>
      </div>

      {modalOpen && (
        <AddProductModal
          onClose={handleCloseModal}
          onSubmit={handleAddProduct}
        />
      )}

      {toast && <Toast message={toast} onClose={handleCloseToast} />}
    </>
  );
};

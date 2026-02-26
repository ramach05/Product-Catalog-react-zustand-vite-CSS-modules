import { memo, useMemo, useState, useEffect } from "react";
import type { ProductsTableProps } from "@/types";
import { formatPriceWithParts, formatRating } from "@/utils/format";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import {
  MoreIcon,
  PaginationNextIcon,
  PaginationPrevIcon,
  PlusCircleIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
} from "@/components/icons";
import styles from "./ProductsTable.module.css";

const ProductsTableComponent = ({
  products,
  total,
  page,
  limit,
  loading,
  searchQuery,
  sortBy,
  order,
  selectedIds,
  headerRight,
  onSort,
  onSearchChange,
  onPageChange,
  onRefresh,
  onAddClick,
  onToggleSelect,
  onToggleSelectAll,
}: ProductsTableProps) => {
  const [displayRange, setDisplayRange] = useState({
    start: 0,
    end: 0,
    total: 0,
  });
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const start = useMemo(() => (page - 1) * limit + 1, [page, limit]);
  const end = useMemo(
    () => (page - 1) * limit + products.length,
    [page, limit, products.length],
  );
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );
  const allIds = useMemo(() => products.map((p) => p.id), [products]);
  const allSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selectedIds.has(id)),
    [allIds, selectedIds],
  );

  const SortHeader = ({
    field,
    label,
  }: {
    field: "title" | "price" | "rating" | "brand";
    label: string;
  }) => (
    <th scope="col">
      <button
        type="button"
        className={styles.tableSort}
        onClick={() => onSort(field)}
      >
        {label}
        {sortBy === field && (
          <span className={styles.tableSortIcon}>
            {order === "asc" ? " ↑" : " ↓"}
          </span>
        )}
      </button>
    </th>
  );

  // Отображаемый диапазон.
  useEffect(() => {
    if (!loading) {
      setDisplayRange({ start, end, total });
    }
  }, [loading, start, end, total]);

  // Скрываем пагинацию при обновлении страницы.
  useEffect(() => {
    if (!loading && total > 0) setHasLoadedOnce(true);
  }, [loading, total]);

  return (
    <section className={styles.page}>
      <div className={styles.headerWrapper}>
        <div className={`${styles.headerStrip} ${styles.headerStripTop}`} />
        <header className={styles.header}>
          <h1 id="products-title" className={styles.title}>
            Товары
          </h1>
          <div className={styles.searchWrap} role="search">
            <SearchIcon />
            <input
              type="search"
              className={styles.search}
              placeholder="Найти"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Поиск по товарам"
            />
          </div>

          {headerRight != null ? (
            <div className={styles.headerRight}>{headerRight}</div>
          ) : null}
        </header>
        <div className={`${styles.headerStrip} ${styles.headerStripBottom}`} />
      </div>

      <div className={styles.toolbar}>
        <h2 id="products-subtitle" className={styles.subtitle}>
          Все позиции
        </h2>
        <div
          className={styles.actions}
          role="group"
          aria-label="Действия с таблицей"
        >
          <Button
            variant="secondary"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Обновить список"
            className={`${styles.toolbarButton} ${styles.toolbarButtonSecondary}`}
          >
            <RefreshIcon />
          </Button>

          <Button
            variant="primary"
            onClick={onAddClick}
            className={styles.toolbarButton}
            aria-label="Добавить товар"
          >
            <PlusCircleIcon />
            Добавить
          </Button>
        </div>
      </div>

      <div className={styles.progressWrap}>{loading && <ProgressBar />}</div>

      <div className={styles.tableWrap}>
        <table
          className={styles.table}
          aria-label="Таблица товаров: наименование, вендор, артикул, оценка, цена, действия"
        >
          <thead>
            <tr>
              <th className={styles.thCheckbox} scope="col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleSelectAll(allIds)}
                  aria-label="Выбрать все строки на странице"
                  disabled={loading}
                />
              </th>
              <SortHeader field="title" label="Наименование" />
              <SortHeader field="brand" label="Вендор" />
              <th scope="col">Артикул</th>
              <SortHeader field="rating" label="Оценка" />
              <SortHeader field="price" label="Цена, Р" />
              <th scope="col">Действия</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr
                    key={`skeleton-${i}`}
                    className={styles.skeletonRow}
                    aria-hidden
                  >
                    <td className={styles.tdCheckbox}>
                      <span
                        className={`${styles.skeleton} ${styles.skeletonCheckbox}`}
                      />
                    </td>
                    <td className={styles.tdName}>
                      <div className={styles.tdNameInner}>
                        <span
                          className={`${styles.skeleton} ${styles.skeletonThumb}`}
                        />
                        <div className={styles.skeletonName}>
                          <span
                            className={`${styles.skeleton} ${styles.skeletonTitle}`}
                          />
                          <span
                            className={`${styles.skeleton} ${styles.skeletonCategory}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className={styles.tdBrand}>
                      <span
                        className={`${styles.skeleton} ${styles.skeletonBrand}`}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.skeleton} ${styles.skeletonSku}`}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.skeleton} ${styles.skeletonRating}`}
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.skeleton} ${styles.skeletonPrice}`}
                      />
                    </td>
                    <td className={styles.tdActions}>
                      <div className={styles.tdActionsInner}>
                        <span
                          className={`${styles.skeleton} ${styles.skeletonBtn}`}
                        />
                        <span
                          className={`${styles.skeleton} ${styles.skeletonBtn}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              : products.map((p) => (
                  <tr
                    key={p.id}
                    className={selectedIds.has(p.id) ? styles.rowSelected : ""}
                  >
                    <td className={styles.tdCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => onToggleSelect(p.id)}
                        aria-label={`Выбрать ${p.title}`}
                      />
                    </td>
                    <td className={styles.tdName}>
                      <div className={styles.tdNameInner}>
                        <div className={styles.tdNameThumb}>
                          {p.thumbnail ? (
                            <img src={p.thumbnail} alt="" />
                          ) : (
                            <div className={styles.tdNamePlaceholder} />
                          )}
                        </div>
                        <div>
                          <div className={styles.tdNameTitle}>{p.title}</div>
                          {p.category && (
                            <div className={styles.tdNameCategory}>
                              {p.category}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tdBrand}>{p.brand}</td>
                    <td>{p.sku ?? "—"}</td>
                    <td>
                      {(() => {
                        const full = formatRating(p.rating);
                        const [value, suffix] = full.split("/");
                        return (
                          <>
                            <span
                              className={p.rating < 3 ? styles.ratingLow : ""}
                            >
                              {value}
                            </span>
                            {suffix != null ? `/${suffix}` : ""}
                          </>
                        );
                      })()}
                    </td>
                    <td>
                      {(() => {
                        const { int, frac } = formatPriceWithParts(p.price);
                        return (
                          <>
                            <span>{int}</span>
                            <span className={styles.priceFrac}>{frac}</span>
                          </>
                        );
                      })()}
                    </td>
                    <td className={styles.tdActions}>
                      <div className={styles.tdActionsInner}>
                        <button
                          type="button"
                          className={`${styles.btnIcon} ${styles.btnIconPrimary} ${styles.btnIconOval}`}
                          aria-label={`Добавить товар «${p.title}»`}
                        >
                          <PlusIcon />
                        </button>
                        <button
                          type="button"
                          className={`${styles.btnIcon} ${styles.btnIconSecondary}`}
                          aria-label={`Дополнительные действия для «${p.title}»`}
                        >
                          <MoreIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {hasLoadedOnce && (
        <footer className={styles.footer} aria-label="Итоги и пагинация">
          <span className={styles.range}>
            Показано&nbsp;
            <span className={styles.rangeNum}>
              {displayRange.total === 0
                ? "—"
                : `${displayRange.start}–${displayRange.end}`}
            </span>
            &nbsp;из&nbsp;
            <span className={styles.rangeNum}>
              {displayRange.total === 0 ? "—" : displayRange.total}
            </span>
          </span>
          <nav
            className={styles.pagination}
            aria-label="Пагинация списка товаров"
          >
            <button
              type="button"
              className={styles.paginationBtn}
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
              aria-label="Предыдущая страница"
            >
              <PaginationPrevIcon />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  type="button"
                  className={`${styles.paginationBtn} ${p === page ? styles.paginationBtnActive : ""}`}
                  onClick={() => onPageChange(p)}
                  disabled={loading}
                  aria-label={
                    p === page ? `Текущая страница, ${p}` : `Страница ${p}`
                  }
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}
            <button
              type="button"
              className={styles.paginationBtn}
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
              aria-label="Следующая страница"
            >
              <PaginationNextIcon />
            </button>
          </nav>
        </footer>
      )}
    </section>
  );
};

export const ProductsTable = memo(ProductsTableComponent);

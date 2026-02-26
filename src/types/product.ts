/** Модель товара */
export interface Product {
  /** Уникальный идентификатор. */
  id: number;
  /** Название товара. */
  title: string;
  /** Описание (опционально). */
  description?: string;
  /** Категория (например, "beauty", "Аксессуары"). */
  category: string;
  /** Цена. */
  price: number;
  /** Процент скидки (опционально). */
  discountPercentage?: number;
  /** Рейтинг (например, 4.3). */
  rating: number;
  /** Остаток на складе (опционально). */
  stock?: number;
  /** Бренд / вендор. */
  brand: string;
  /** Артикул (опционально). */
  sku?: string;
  /** URL миниатюры (опционально). */
  thumbnail?: string;
  /** Массив URL изображений (опционально). */
  images?: string[];
}

/** Ответ API списка товаров. */
export interface ProductsListResponse {
  /** Массив товаров на текущей странице. */
  products: Product[];
  /** Общее количество товаров по запросу. */
  total: number;
  /** Сколько записей пропущено (offset пагинации). */
  skip: number;
  /** Запрошенный лимит на страницу. */
  limit: number;
}

/** Поля, по которым возможна сортировка таблицы товаров. */
export type ProductSortField = "title" | "price" | "rating" | "brand";

/** Данные формы добавления товара (без API). */
export interface AddProductFormData {
  /** Название товара. */
  title: string;
  /** Цена (число). */
  price: number;
  /** Бренд. */
  brand: string;
  /** Артикул. */
  sku: string;
}

/** Параметры запроса списка товаров. */
export interface FetchProductsParams {
  /** Количество товаров на странице.
   * @default 5
   */
  limit?: number;
  /** Смещение (сколько записей пропустить).
   * @default 0
   */
  skip?: number;
  /** Поле сортировки (если не задано — порядок по умолчанию API). */
  sortBy?: ProductSortField;
  /** Направление сортировки. */
  order?: "asc" | "desc";
  /** Передается в fetch для отмены запроса при размонтировании. */
  signal?: AbortSignal;
}

/** Направление сортировки таблицы товаров. */
export type SortOrder = "asc" | "desc";

/** Состояние и действия стора товаров. */
export interface ProductsState {
  /** Товары с API на текущей странице.
   * @default []
   */
  items: Product[];
  /** Общее количество товаров по текущему запросу.
   * @default 0
   */
  total: number;
  /** Текущая страница пагинации.
   * @default 1
   */
  page: number;
  /** Количество товаров на странице.
   * @default 5
   */
  limit: number;
  /** Флаг загрузки списка.
   * @default false
   */
  loading: boolean;
  /** Сообщение об ошибке или null.
   * @default null
   */
  error: string | null;
  /** Поле сортировки или null (порядок по умолчанию).
   * @default null
   */
  sortBy: ProductSortField | null;
  /** Направление сортировки.
   * @default "asc"
   */
  order: SortOrder;
  /** Строка поиска.
   * @default ""
   */
  searchQuery: string;
  /** Множество id выбранных строк таблицы.
   * @default new Set()
   */
  selectedIds: Set<number>;
  /** Товары, добавленные через форму без API.
   * @default []
   */
  localProducts: Product[];
  /** Счётчик для генерации отрицательных id локальных товаров.
   * @default 0
   */
  lastLocalId: number;
  /** Загрузка списка товаров; signal — для отмены при размонтировании. */
  loadProducts: (signal?: AbortSignal) => Promise<void>;
  /** Установить текущую страницу пагинации. */
  setPage: (page: number) => void;
  /** Переключить сортировку по полю (цикл asc → desc). */
  setSort: (field: ProductSortField) => void;
  /** Установить строку поиска и сбросить страницу на 1. */
  setSearchQuery: (q: string) => void;
  /** Переключить выбор строки по id. */
  toggleSelect: (id: number) => void;
  /** Выбрать все строки текущей страницы или снять с них выбор. */
  toggleSelectAll: (currentPageIds: number[]) => void;
  /** Снять выбор со всех строк. */
  clearSelection: () => void;
  /** Добавить локальный товар по данным формы; возвращает созданный Product. */
  addLocalProduct: (data: AddProductFormData) => Product;
  /** Установить флаг загрузки (для внешнего управления). */
  setLoading: (loading: boolean) => void;
  /** Установить сообщение об ошибке или null. */
  setError: (error: string | null) => void;
  /** Сбросить пагинацию и поиск (для выхода из аккаунта). */
  resetProductsPersisted: () => void;
}

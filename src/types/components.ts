import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import type { AddProductFormData } from "./product";
import type { Product } from "./product";
import type { ProductSortField } from "./product";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант оформления кнопки. */
  variant?: "primary" | "secondary" | "ghost";
  /** Содержимое кнопки. */
  children: React.ReactNode;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Подпись над полем. */
  label?: string;
  /** Текст ошибки валидации (под полем). */
  error?: string;
  /** Иконка слева от поля. */
  leftIcon?: React.ReactNode;
  /** Иконка справа от поля. */
  rightIcon?: React.ReactNode;
}

export interface ToastProps {
  /** Текст уведомления. */
  message: string;
  /** Вызывается при закрытии (вручную или по таймеру). */
  onClose: () => void;
  /** Время показа в мс перед автозакрытием.
   * @default 3000
   */
  duration?: number;
}

export interface AddProductModalProps {
  /** Закрытие модалки (клик по фону или крестик). */
  onClose: () => void;
  /** Отправка данных формы; после вызова модалка закрывается. */
  onSubmit: (data: AddProductFormData) => void;
}

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /** Текст рядом с чекбоксом. */
  label: string;
}

export interface ProtectedRouteProps {
  /** Контент, показываемый при авторизации. */
  children: React.ReactNode;
}

export interface ProductsTableProps {
  /** Список товаров для отображения на текущей странице. */
  products: Product[];
  /** Общее количество товаров. */
  total: number;
  /** Текущая страница пагинации. */
  page: number;
  /** Количество строк на странице. */
  limit: number;
  /** Показывать индикатор загрузки. */
  loading: boolean;
  /** Строка поиска. */
  searchQuery: string;
  /** Поле сортировки или null. */
  sortBy: string | null;
  /** Направление сортировки. */
  order: "asc" | "desc";
  /** Множество id выбранных строк. */
  selectedIds: Set<number>;
  /** Слот справа в шапке (например, кнопка «Выйти»). */
  headerRight?: React.ReactNode;
  /** Обработчик клика по заголовку колонки (переключение сортировки). */
  onSort: (field: ProductSortField) => void;
  /** Обработчик изменения строки поиска. */
  onSearchChange: (q: string) => void;
  /** Обработчик смены страницы. */
  onPageChange: (page: number) => void;
  /** Обработчик обновления списка (повторный запрос). */
  onRefresh: () => void;
  /** Обработчик нажатия «Добавить товар». */
  onAddClick: () => void;
  /** Обработчик переключения выбора строки по id. */
  onToggleSelect: (id: number) => void;
  /** Обработчик «выбрать все / снять все» на текущей странице. */
  onToggleSelectAll: (currentPageIds: number[]) => void;
}

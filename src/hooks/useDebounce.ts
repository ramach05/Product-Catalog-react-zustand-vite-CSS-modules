import { useState, useEffect } from "react";

/**
 * Возвращает значение, обновленное с задержкой (debounce). При изменении value до истечения delay таймер сбрасывается.
 * В cleanup эффекта таймер очищается, чтобы не обновлять state после размонтирования или при смене зависимостей.
 * @param value — текущее значение (например, строка поиска)
 * @param delay — задержка в мс
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debouncedValue;
};

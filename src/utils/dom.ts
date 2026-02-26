/**
 * Генерирует уникальный id для DOM-элемента (например, input/label).
 * @param prefix — префикс (например, "input", "cb")
 * @returns строка вида "input-abc12" или "cb-xyz34"
 */
export const generateDomId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2)}`;

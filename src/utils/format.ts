/**
 * Форматирует число как цену в формате локали ru-RU (разделители тысяч и два знака после запятой).
 * Цена округляется до целого, но отображается с двумя нулями после запятой (например, 9.99 → "10,00").
 * @param value — число для форматирования
 * @returns строка вида "48 652,00"
 */
export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.round(value));

/**
 * Форматирует цену и разбивает на целую и дробную части для разного оформления (например, бледная дробная часть).
 * Цена округляется до целого, но отображается с двумя нулями после запятой (например, 9.99 → "10,00").
 * @param value — число (цена)
 * @returns объект с полями int (целая часть с разделителем тысяч) и frac (строка с запятой и копейками, например ",00")
 */
export const formatPriceWithParts = (
  value: number,
): { int: string; frac: string } => {
  const rounded = Math.round(value);
  const formatted = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
  const [, int, frac] = formatted.match(/^(.+?),(\d+)$/) ?? [
    null,
    formatted,
    "",
  ];

  return { int: int ?? formatted, frac: frac ? `,${frac}` : "" };
};

/**
 * Форматирует рейтинг в строку вида "4.3/5".
 * @param rating — число рейтинга
 * @returns строка "X.X/5"
 */
export const formatRating = (rating: number): string =>
  `${Number(rating).toFixed(1)}/5`;

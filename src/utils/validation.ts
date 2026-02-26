/**
 * Валидирует поля формы добавления товара.
 * @param fields — сырые значения полей (строки из инпутов)
 * @returns объект «имя поля → сообщение об ошибке»; пустой объект, если ошибок нет
 */
export const validateAddProductForm = (fields: {
  /** Название товара. */
  title: string;
  /** Цена товара. */
  price: string;
  /** Вендор товара. */
  brand: string;
  /** Артикул товара. */
  sku: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!fields.title.trim()) errors.title = "Обязательное поле";

  const priceNum = parseFloat(fields.price.replace(",", "."));

  if (fields.price === "" || Number.isNaN(priceNum) || priceNum < 0) {
    errors.price = "Введите корректную цену";
  }
  if (!fields.brand.trim()) errors.brand = "Обязательное поле";
  if (!fields.sku.trim()) errors.sku = "Обязательное поле";

  return errors;
};

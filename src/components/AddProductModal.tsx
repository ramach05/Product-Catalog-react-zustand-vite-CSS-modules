import { memo, useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import type { AddProductModalProps } from "@/types";
import { validateAddProductForm } from "@/utils/validation";
import styles from "./AddProductModal.module.css";

const AddProductModalComponent = ({
  onClose,
  onSubmit,
}: AddProductModalProps) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validateAddProductForm({ title, price, brand, sku });
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    const priceNum = parseFloat(price.replace(",", "."));

    onSubmit({
      title: title.trim(),
      price: priceNum,
      brand: brand.trim(),
      sku: sku.trim(),
    });

    onClose();
  };

  // Закрываем модальное окно при нажатии на Esc.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="modal-add-product-title" className={styles.title}>
            Добавить товар
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Наименование"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            error={errors.title}
            placeholder="Название товара"
          />
          <Input
            label="Цена, Р"
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrice(e.target.value)
            }
            error={errors.price}
            placeholder="0.00"
          />
          <Input
            label="Вендор"
            value={brand}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBrand(e.target.value)
            }
            error={errors.brand}
            placeholder="Производитель"
          />
          <Input
            label="Артикул"
            value={sku}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSku(e.target.value)
            }
            error={errors.sku}
            placeholder="Артикул"
          />
          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">Добавить</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AddProductModal = memo(AddProductModalComponent);

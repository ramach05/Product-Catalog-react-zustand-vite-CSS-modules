import { memo, useEffect } from "react";
import type { ToastProps } from "@/types";
import styles from "./Toast.module.css";

const ToastComponent = ({ message, onClose, duration = 3000 }: ToastProps) => {
  // Автозакрытие тоста.
  useEffect(() => {
    const t = setTimeout(onClose, duration);

    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className={styles.toast} role="status">
      {message}
    </div>
  );
};

export const Toast = memo(ToastComponent);

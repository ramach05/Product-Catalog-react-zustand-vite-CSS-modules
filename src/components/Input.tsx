import { memo } from "react";
import type { InputProps } from "@/types";
import { generateDomId } from "@/utils/dom";
import styles from "./Input.module.css";

const InputComponent = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  id,
  ...props
}: InputProps) => {
  const inputId = id ?? generateDomId("input");
  const errorId = `${inputId}-error`;

  return (
    <div className={`${styles.wrap} ${error ? styles.wrapError : ""}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={styles.box}>
        {leftIcon && (
          <span className={`${styles.icon} ${styles.iconLeft}`}>
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`${styles.input} ${leftIcon ? styles.inputWithLeft : ""} ${rightIcon ? styles.inputWithRight : ""} ${className}`.trim()}
          {...props}
        />
        {rightIcon && (
          <span className={`${styles.icon} ${styles.iconRight}`}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export const Input = memo(InputComponent);

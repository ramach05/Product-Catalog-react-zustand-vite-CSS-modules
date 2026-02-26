import { memo } from "react";
import type { ButtonProps } from "@/types";
import styles from "./Button.module.css";

const variantClass = {
  primary: styles.btnPrimary,
  secondary: styles.btnSecondary,
  ghost: styles.btnGhost,
};

const ButtonComponent = ({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.btn} ${variantClass[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export const Button = memo(ButtonComponent);

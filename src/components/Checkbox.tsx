import { memo } from "react";
import type { CheckboxProps } from "@/types";
import { generateDomId } from "@/utils/dom";
import styles from "./Checkbox.module.css";

const CheckboxComponent = ({
  label,
  id,
  className = "",
  ...props
}: CheckboxProps) => {
  const inputId = id ?? generateDomId("cb");

  return (
    <label className={`${styles.wrap} ${className}`.trim()} htmlFor={inputId}>
      <input type="checkbox" id={inputId} className={styles.input} {...props} />
      <span className={styles.box} />
      <span className={styles.label}>{label}</span>
    </label>
  );
};

export const Checkbox = memo(CheckboxComponent);

import { memo } from "react";
import styles from "./ProgressBar.module.css";

const ProgressBarComponent = () => (
  <div className={styles.bar} role="progressbar" aria-label="Загрузка">
    <div className={styles.fill} />
  </div>
);

export const ProgressBar = memo(ProgressBarComponent);

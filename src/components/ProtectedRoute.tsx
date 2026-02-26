import { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { ProtectedRouteProps } from "@/types";
import styles from "./ProtectedRoute.module.css";

export const ProtectedRoute = memo(({ children }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        Загрузка…
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});

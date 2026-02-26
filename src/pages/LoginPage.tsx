import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import styles from "./LoginPage.module.css";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Checkbox } from "@/components/Checkbox";
import {
  ClearIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  LogoIcon,
  UserIcon,
} from "@/components/icons";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/products";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!username.trim()) next.username = "Обязательное поле";
    if (!password) next.password = "Обязательное поле";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setErrors({});

    try {
      await login({ username: username.trim(), password }, remember);

      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message === "Failed to fetch"
            ? "Нет связи с сервером. Проверьте интернет и перезапустите dev-сервер (npm run dev)."
            : err.message
          : "Ошибка входа";

      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    navigate(from, { replace: true });
    return null;
  }

  return (
    <main
      id="main-content"
      className={styles.page}
      aria-label="Форма входа в аккаунт"
    >
      <div className={styles.card}>
        <div className={styles.logo}>
          <LogoIcon />
        </div>
        <h1 id="login-title" className={styles.title}>
          Добро пожаловать!
        </h1>
        <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {errors.form && (
            <div className={styles.formError} role="alert">
              {errors.form}
            </div>
          )}
          <Input
            label="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() =>
              setErrors((e) => ({ ...e, username: undefined, form: undefined }))
            }
            placeholder="Введите логин"
            autoComplete="username"
            error={errors.username}
            leftIcon={<UserIcon />}
            rightIcon={
              username ? (
                <button
                  type="button"
                  onClick={() => setUsername("")}
                  aria-label="Очистить"
                >
                  <ClearIcon />
                </button>
              ) : undefined
            }
          />
          <Input
            label="Пароль"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() =>
              setErrors((e) => ({ ...e, password: undefined, form: undefined }))
            }
            placeholder="Введите пароль"
            autoComplete="current-password"
            error={errors.password}
            leftIcon={<LockIcon />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Показать пароль" : "Скрыть пароль"}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            }
          />
          <Checkbox
            label="Запомнить данные"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Button type="submit" disabled={loading} className={styles.submit}>
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>

        <div className={styles.divider} role="presentation">
          <span className={styles.dividerLine} aria-hidden />
          <span className={styles.dividerText}>или</span>
          <span className={styles.dividerLine} aria-hidden />
        </div>
        <p className={styles.register}>
          Нет аккаунта?{" "}
          <a href="#create" className={styles.registerLink}>
            Создать
          </a>
        </p>
      </div>
    </main>
  );
};

/** Учётные данные для входа. */
export interface LoginCredentials {
  /** Логин пользователя. */
  username: string;
  /** Пароль. */
  password: string;
}

/** Успешный ответ API логина. */
export interface LoginResponse {
  /** Идентификатор пользователя. */
  id: number;
  /** Логин. */
  username: string;
  /** Email пользователя. */
  email: string;
  /** Имя. */
  firstName: string;
  /** Фамилия. */
  lastName: string;
  /** Пол (строка из API). */
  gender: string;
  /** URL аватара. */
  image: string;
  /** Токен доступа, сохраняем в storage. */
  accessToken: string;
  /** Токен обновления. */
  refreshToken: string;
}

/** Тело ответа при ошибке авторизации (например, 401). */
export interface AuthErrorResponse {
  /** Сообщение об ошибке от API, если есть. */
  message?: string;
}

/** Состояние и действия стора авторизации (Zustand). */
export interface AuthState {
  /** Токен доступа или null, если не авторизован.
   * @default null
   */
  token: string | null;
  /** true после первой проверки токена из storage.
   * @default false
   */
  isInitialized: boolean;
  /** Вход: запрос к API и сохранение токена (remember — в localStorage иначе sessionStorage). */
  login: (credentials: LoginCredentials, remember: boolean) => Promise<void>;
  /** Выход: удаление токена из storage и сброс state. */
  logout: () => void;
  /** Инициализация при старте приложения: чтение токена из storage. */
  init: () => void;
}

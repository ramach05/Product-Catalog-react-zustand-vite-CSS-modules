/** Ключи для storage. */
const TOKEN_KEY = "uniq_auth_token";
/** Ключ для типа хранилища токена. */
const STORAGE_TYPE_KEY = "user_auth_storage";

/** Тип хранилища для токена: local — переживает закрытие браузера, session — только вкладка. */
export type StorageType = "local" | "session";

/**
 * Сохраняет токен авторизации в localStorage (если persist) или sessionStorage и запоминает тип хранилища.
 * Токен хранится только в одном месте: при persist=true очищается sessionStorage, при false — localStorage.
 * @param token — JWT или иной токен доступа
 * @param persist — true: переживает закрытие браузера (localStorage), false: только текущая вкладка (sessionStorage)
 */
export const setToken = (token: string, persist: boolean): void => {
  if (persist) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(STORAGE_TYPE_KEY, "local");
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(STORAGE_TYPE_KEY, "session");
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Читает сохраненный токен из localStorage или sessionStorage в соответствии с ранее выбранным типом хранилища.
 * @returns токен или null, если не найден
 */
export const getToken = (): string | null => {
  const type = localStorage.getItem(STORAGE_TYPE_KEY) as StorageType | null;
  if (type === "local") return localStorage.getItem(TOKEN_KEY);
  if (type === "session") return sessionStorage.getItem(TOKEN_KEY);
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Удаляет токен и метаданные хранилища из localStorage и sessionStorage (полный выход).
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STORAGE_TYPE_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

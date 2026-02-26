import type {
  LoginCredentials,
  LoginResponse,
  AuthErrorResponse,
} from "@/types";
import { API_BASE } from "./config";

const AUTH_BASE = `${API_BASE}/auth`;

/** Вход в систему. */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60,
    }),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    const err = data as AuthErrorResponse;
    throw new Error(err.message ?? "Ошибка авторизации");
  }

  return data as LoginResponse;
}

/** Получение информации о пользователе. */
export async function getMe(accessToken: string): Promise<{ id: number }> {
  const res = await fetch(`${AUTH_BASE}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Сессия недействительна");
  const data = await res.json();
  return { id: data.id };
}

import { create } from "zustand";
import { getMe, login as loginApi } from "@/api/authApi";
import * as storage from "@/utils/storage";
import { useProductsStore } from "@/store/productsStore";
import type { AuthState, LoginCredentials } from "@/types";

/** Состояние и действия стора авторизации (Zustand). */
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isInitialized: false,

  init() {
    const token = storage.getToken();
    if (!token) {
      set({ token: null, isInitialized: true });

      return;
    }

    getMe(token)
      .then(() => set({ token, isInitialized: true }))
      .catch(() => {
        storage.removeToken();
        set({ token: null, isInitialized: true });
      });
  },

  async login(credentials: LoginCredentials, remember: boolean) {
    const res = await loginApi(credentials);
    storage.setToken(res.accessToken, remember);
    set({ token: res.accessToken });
  },

  logout() {
    storage.removeToken();
    useProductsStore.getState().resetProductsPersisted();
    set({ token: null });
  },
}));

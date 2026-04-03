import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "RESTO_ADMIN";
  restaurantId?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuth: false,
      setAuth: (user, token) => {
        if (typeof window !== "undefined")
          localStorage.setItem("zto_token", token);
        set({ user, token, isAuth: true });
      },
      logout: () => {
        if (typeof window !== "undefined") localStorage.removeItem("zto_token");
        set({ user: null, token: null, isAuth: false });
      },
    }),
    {
      name: "zto-auth",
      partialize: (s) => ({ user: s.user, token: s.token, isAuth: s.isAuth }),
    },
  ),
);

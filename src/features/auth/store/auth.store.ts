import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/features/auth/auth.types";
import { parseJwt, isTokenValid } from "@/utils/jwt";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => {
        const payload = parseJwt(token);
        const valid = isTokenValid(token);
        set({
          token: valid ? token : null,
          isAuthenticated: valid,
          user:
            valid && payload
              ? {
                  id: payload.sub,
                  userName: payload.userName,
                  role: payload.scope,
                }
              : null,
        });
      },
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "tvs-auth",
      onRehydrateStorage: () => (state) => {
        if (state && !isTokenValid(state.token)) {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      },
    },
  ),
);

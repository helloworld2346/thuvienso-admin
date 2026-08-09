import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/features/auth/auth.types";
import { parseJwt } from "@/utils/jwt";

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
        set({
          token,
          isAuthenticated: !!payload,
          user: payload
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
    { name: "tvs-auth" },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginResponse, Role } from '@/lib/types/types';

type AuthState = {
  token: string | null;
  username: string | null;
  role: Role | null;
  sessionId: number | null;
  sessionName: string | null;
  hasHydrated: boolean;
  setAuth: (data: LoginResponse) => void;
  clearAuth: () => void;
  setHasHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      sessionId: null,
      sessionName: null,
      hasHydrated: false,

      setAuth: (data) =>
        set({
          token: data.token,
          username: data.username,
          role: data.role,
          sessionId: data.sessionId,
          sessionName: data.sessionName,
        }),

      clearAuth: () =>
        set({
          token: null,
          username: null,
          role: null,
          sessionId: null,
          sessionName: null,
        }),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  hasExplicitPreference: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSystemTheme: (theme: Theme) => void;
};

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      hasExplicitPreference: false,

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme, hasExplicitPreference: true });
      },

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        applyTheme(next);
        set({ theme: next, hasExplicitPreference: true });
      },

      // Called by the system color-scheme listener; ignored once the user has picked a theme.
      setSystemTheme: (theme) => {
        if (get().hasExplicitPreference) return;
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "theme-storage",
      // Until the user explicitly chooses a theme, always defer to the system preference
      // rather than whatever was last persisted.
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ThemeState> | undefined;

        if (persisted?.hasExplicitPreference) {
          return { ...currentState, ...persisted };
        }

        return { ...currentState, theme: getSystemTheme(), hasExplicitPreference: false };
      },
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    }
  )
);

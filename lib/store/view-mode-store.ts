import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = "compact" | "full";

type ViewModeState = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
};

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set, get) => ({
      viewMode: "compact",

      setViewMode: (mode) => set({ viewMode: mode }),

      toggleViewMode: () =>
        set({ viewMode: get().viewMode === "compact" ? "full" : "compact" }),
    }),
    { name: "view-mode" }
  )
);

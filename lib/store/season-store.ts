import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SeasonState = {
  // Lista vacía = "Todas las temporadas"
  selectedSeasonIds: number[];
  // Se vuelve true en cuanto hay una selección explícita (por el usuario o por el valor por defecto)
  initialized: boolean;
  toggleSeason: (id: number) => void;
  selectAll: () => void;
  initializeDefault: (id: number) => void;
};

export const useSeasonStore = create<SeasonState>()(
  persist(
    (set, get) => ({
      selectedSeasonIds: [],
      initialized: false,

      toggleSeason: (id) => {
        const current = get().selectedSeasonIds;
        const next = current.includes(id)
          ? current.filter((s) => s !== id)
          : [...current, id];

        set({ selectedSeasonIds: next, initialized: true });
      },

      selectAll: () => set({ selectedSeasonIds: [], initialized: true }),

      initializeDefault: (id) => {
        if (get().initialized) return;
        set({ selectedSeasonIds: [id], initialized: true });
      },
    }),
    { name: "season-filter" }
  )
);

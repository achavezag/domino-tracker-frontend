'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSeasons } from '@/lib/api/api';
import { Season } from '@/lib/types/types';
import { useSeasonStore } from '@/lib/store/season-store';
import { Spinner } from '@/components/ui/spinner';

function findCurrentSeasonId(seasons: Season[]): number | null {
  const now = Date.now();

  const current = seasons.find((season) => {
    const start = new Date(season.startDate).getTime();
    const end = season.endDate ? new Date(season.endDate).getTime() : null;

    return start <= now && (end === null || now <= end);
  });

  if (current) return current.id;

  if (seasons.length === 0) return null;

  const latest = [...seasons].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )[0];

  return latest.id;
}

export default function SeasonSelector() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: seasons = [], isLoading: seasonsLoading } = useQuery<Season[]>({
    queryKey: ["seasons"],
    queryFn: getSeasons,
  });

  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);
  const initialized = useSeasonStore((s) => s.initialized);
  const toggleSeason = useSeasonStore((s) => s.toggleSeason);
  const selectAll = useSeasonStore((s) => s.selectAll);
  const initializeDefault = useSeasonStore((s) => s.initializeDefault);

  useEffect(() => {
    if (initialized || seasons.length === 0) return;

    const currentSeasonId = findCurrentSeasonId(seasons);
    if (currentSeasonId !== null) {
      initializeDefault(currentSeasonId);
    }
  }, [initialized, seasons, initializeDefault]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAll =
    selectedSeasonIds.length === 0 ||
    (seasons.length > 0 &&
      seasons.every((s) => selectedSeasonIds.includes(s.id)));

  const summary = isAll
    ? "Todas"
    : seasons
        .filter((s) => selectedSeasonIds.includes(s.id))
        .map((s) => `Temporada ${s.alias}`)
        .join(", ") || "Todas";

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1 w-full px-2">
      <span className="text-xs text-muted-foreground">Temporadas</span>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={seasonsLoading}
        className="w-full truncate border rounded px-2 py-1 text-left text-sm hover:bg-ring/10 disabled:opacity-50"
        title={summary}
      >
        {seasonsLoading ? (
          <span className="flex items-center gap-2">
            <Spinner /> Cargando...
          </span>
        ) : (
          summary
        )}
      </button>

      {open && (
        <div className="absolute left-2 top-full z-50 mt-1 w-48 rounded-md border bg-popover shadow-lg p-1">
          <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-ring/10 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={isAll}
              onChange={() => selectAll()}
            />
            <span>Todas</span>
          </label>

          <div className="my-1 border-t" />

          {seasons.map((season) => (
            <label
              key={season.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-ring/10 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selectedSeasonIds.includes(season.id)}
                onChange={() => toggleSeason(season.id)}
              />
              <span>Temporada {season.alias}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

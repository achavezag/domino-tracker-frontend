'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eraser } from 'lucide-react';
import { getMatches } from '@/lib/api/api';
import { MatchListItem } from '@/lib/types/types';
import { useSeasonStore } from '@/lib/store/season-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LoadingState } from '@/components/ui/spinner';
import DayMatchupCard from './day-matchup-card';

type Matchup = {
  teamAName: string;
  teamBName: string;
  type: string;
  matches: MatchListItem[];
};

function groupByMatchup(matches: MatchListItem[]): Matchup[] {
  const groups = new Map<string, Matchup>();

  for (const match of matches) {
    const key = `${[match.teamAName, match.teamBName].sort().join("|")}|${match.type}`;

    if (!groups.has(key)) {
      groups.set(key, {
        teamAName: match.teamAName,
        teamBName: match.teamBName,
        type: match.type,
        matches: [],
      });
    }

    groups.get(key)!.matches.push(match);
  }

  for (const group of groups.values()) {
    group.matches.sort((a, b) => (a.finishedAt ?? "").localeCompare(b.finishedAt ?? ""));
  }

  return Array.from(groups.values());
}

export default function DayClient() {
  const [date, setDate] = useState<string>("");
  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data: matches = [], isLoading } = useQuery<MatchListItem[]>({
    queryKey: ["matches", { fromDate: date, toDate: date }, selectedSeasonIds],
    queryFn: () => getMatches({ fromDate: date, toDate: date, seasonIds: selectedSeasonIds }),
    enabled: !!date,
  });

  const matchups = groupByMatchup(matches);

  return (
    <div className="flex flex-col gap-2 pb-3">

      {/* FILTERS */}
      <div className="sticky top-0 z-10 -mt-0.5 bg-background py-1.5 md:py-2 flex items-center justify-between gap-2 px-2 md:px-3 border-b border-ring">
        <h1 className="text-lg md:text-xl font-semibold text-shadow-2xs hidden md:block">
          Día de juego
        </h1>

        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-2">
          <Input
            type="date"
            className="w-36 md:w-fit text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Button
            variant="outline"
            className="hidden md:inline-flex"
            onClick={() => setDate("")}
          >
            Limpiar
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="w-10 px-2 md:hidden"
                onClick={() => setDate("")}
              >
                <Eraser className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Limpiar</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* CONTENT */}
      {!date ? (
        <p className="text-center text-muted-foreground pt-6">
          Selecciona una fecha para mostrar los resultados.
        </p>
      ) : isLoading ? (
        <LoadingState />
      ) : matchups.length === 0 ? (
        <p className="text-center text-muted-foreground pt-6">
          No hay partidos registrados para esta fecha.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchups.map((matchup) => (
            <DayMatchupCard
              key={`${matchup.teamAName}|${matchup.teamBName}|${matchup.type}`}
              teamAName={matchup.teamAName}
              teamBName={matchup.teamBName}
              type={matchup.type}
              matches={matchup.matches}
            />
          ))}
        </div>
      )}

    </div>
  );
}

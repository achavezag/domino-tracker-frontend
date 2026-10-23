'use client';

import { useQuery } from '@tanstack/react-query';
import { getMatches, getTeams, getTeamsStats } from '@/lib/api/api';
import { MatchType, Team, TeamStats } from '@/lib/types/types';
import TeamCard from './team-card';
import { useState } from 'react';
import MatchCard from '../match/match-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSeasonStore } from '@/lib/store/season-store';
import { LoadingState } from '@/components/ui/spinner';
import ViewModeSwitch from '../view-mode-switch';

type Filters = {
  opponentTeamId?: string;
  type?: MatchType;
  fromDate?: string;
  toDate?: string;
};

export default function TeamsClient() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | undefined>(undefined);

  const [filters, setFilters] = useState<Filters>({
    opponentTeamId: undefined,
    type: undefined,
    fromDate: undefined,
    toDate: undefined
  });

  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const { data: teamStats = [], isLoading: statsLoading } = useQuery<TeamStats[]>({
    queryKey: ["teams-stats", selectedSeasonIds],
    queryFn: () => getTeamsStats(selectedSeasonIds),
  });

  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["matches", selectedTeamId, filters, selectedSeasonIds],
    queryFn: () =>
      getMatches({
        teamAId: selectedTeamId,
        teamBId: filters.opponentTeamId,
        type: filters.type,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        seasonIds: selectedSeasonIds,
      }),
    enabled: !!selectedTeamId,
  });

  const statsMap = new Map(
    teamStats.map((s) => [s.teamId, s])
  );

  const visibleTeams = [...teams]
    .filter((team) => (statsMap.get(team.id)?.matchesPlayed ?? 0) > 0)
    .sort(
      (a, b) =>
        (statsMap.get(b.id)?.winRate ?? 0) - (statsMap.get(a.id)?.winRate ?? 0)
    );

   const selectedTeam = teams.find(t => t.id === selectedTeamId);

  const winsA = matches.filter(
    (m) => m.winningTeamId === selectedTeamId
  ).length;

  const lossesA = matches.filter(
    (m) =>
      m.winningTeamId &&
      m.winningTeamId !== selectedTeamId
  ).length;

  const winsB = filters.opponentTeamId
    ? matches.filter((m) => m.winningTeamId === filters.opponentTeamId).length
    : lossesA;

  if (teamsLoading || statsLoading) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col">

      <div className="flex items-center justify-end mb-2 pr-28 py-4 border-b border-ring">
        <ViewModeSwitch />
      </div>

      <div className="flex flex-col pb-2">
        <div className="grid grid-cols-4 gap-4">

          {/* TEAMS */}
          {visibleTeams
            .filter((team) =>
              selectedTeamId ? team.id === selectedTeamId : true
            )
            .map((team) => {
              const stats = statsMap.get(team.id);

              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  stats={stats}
                  onClick={() => {
                    const isSame = selectedTeamId === team.id;

                    if (isSame) {
                      setSelectedTeamId(undefined);
                    } else {
                      setSelectedTeamId(team.id);
                    }
                    
                    setFilters({
                      opponentTeamId: undefined,
                      type: undefined,
                      fromDate: undefined,
                      toDate: undefined,
                    });
                  }}
                  selected={selectedTeamId === team.id}
                />
              );
            })}
        </div>

        {/* HISTORIAL + FILTROS */}
        {selectedTeamId && selectedTeam && (
          <div className="mt-6 flex flex-col gap-4">

            {/* HEADER + FILTERS */}
            <div className="flex w-full items-center justify-between gap-3 px-3 py-2 border border-ring rounded-xl">

              <h2 className="text-lg font-semibold whitespace-nowrap">
                Historial
              </h2>

              <div className="flex items-center gap-3 flex-wrap text-sm">

                <span className="pr-2 whitespace-nowrap">
                  {selectedTeam.player1.nickname} / {selectedTeam.player2.nickname}
                </span>

                {/* SCORE */}
                <span className="font-bold">{winsA}</span>

                <span>-</span>

                <span className="font-bold">{winsB}</span>

                {/* VS TEAM */}
                <Select
                  value={filters.opponentTeamId ?? "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      opponentTeamId:
                        value === "all"
                          ? undefined
                          : value,
                    }))
                  }
                >
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Global" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      Global
                    </SelectItem>

                    {teams
                      .filter((t) => t.id !== selectedTeamId)
                      .map((t) => (
                        <SelectItem
                          key={t.id}
                          value={t.id}
                        >
                          {t.player1.nickname} / {t.player2.nickname}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <div className="w-2"></div>

                {/* TYPE */}
                <Select
                  value={filters.type ?? "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      type:
                        value === "all"
                          ? undefined
                          : (value as MatchType),
                    }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      Todos los partidos
                    </SelectItem>

                    <SelectItem value="Fixed">
                      Fijo
                    </SelectItem>

                    <SelectItem value="Rotating">
                      Rotativo
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* FROM DATE */}
                <Input
                  type="date"
                  className="w-fit"
                  value={filters.fromDate ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fromDate: e.target.value || undefined,
                    }))
                  }
                />

                {/* TO DATE */}
                <Input
                  type="date"
                  className="w-fit"
                  value={filters.toDate ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      toDate: e.target.value || undefined,
                    }))
                  }
                />
              </div>

              {/* CLEAR */}
              <Button
                variant="outline"
                className="w-32"
                onClick={() =>
                  setFilters({
                    opponentTeamId: undefined,
                    type: undefined,
                    fromDate: undefined,
                    toDate: undefined,
                  })
                }
              >
                Limpiar
              </Button>
            </div>

            {/* MATCHES */}
            {matchesLoading ? (
              <LoadingState label="Cargando partidos..." />
            ) : matches.length === 0 ? (
              <span>No hay partidos</span>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
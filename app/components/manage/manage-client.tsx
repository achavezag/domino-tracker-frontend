'use client';

import { useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getMatches, getPlayers, getPlayersStats, getSeasons, getTeams } from '@/lib/api/api';
import { MatchListItem, Player, PlayerStats, Season, Team } from '@/lib/types/types';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { formatDate } from '../../../lib/helpers';
import SeasonDialog from './season-dialog';
import SeasonRowMenu from './season-row-menu';
import PlayerDialog from './player-dialog';
import PlayerRowMenu from './player-row-menu';
import TeamDialog from './team-dialog';
import { LoadingState } from '@/components/ui/spinner';
import { useSeasonStore } from '@/lib/store/season-store';

export default function ManageClient() {
  const [search, setSearch] = useState<string>("");
  const [search2, setSearch2] = useState<string>("");
  const [addSeasonOpen, setAddSeasonOpen] = useState(false);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [addTeamOpen, setAddTeamOpen] = useState(false);

  const { data: seasons = [], isLoading: seasonsLoading } = useQuery<Season[]>({
    queryKey: ["seasons"],
    queryFn: getSeasons
  });

  const seasonMatchesQueries = useQueries({
    queries: seasons.map((s) => ({
      queryKey: ["season-matches", s.id],
      queryFn: () => getMatches({ seasonIds: [s.id] }),
      staleTime: 1000 * 60,
    })),
  });

  const seasonMatchesMap = new Map<number, MatchListItem[]>(
    seasons.map((s, i) => [s.id, seasonMatchesQueries[i]?.data ?? []])
  );

  const seasonMatchesLoadingMap = new Map<number, boolean>(
    seasons.map((s, i) => [s.id, seasonMatchesQueries[i]?.isLoading ?? false])
  );

  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data: players = [], isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const { data: playersStats = [], isLoading: playersStatsLoading } = useQuery<PlayerStats[]>({
    queryKey: ["players-stats", selectedSeasonIds],
    queryFn: () => getPlayersStats(selectedSeasonIds),
  });

  const playerStatsMap = new Map(
    playersStats.map((s) => [s.playerId, s])
  );

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const matchesPlayer = (team: Team, text: string) => {
    if (!text) return true;

    const lower = text.toLowerCase();

    return (
      team.player1.name.toLowerCase().includes(lower) ||
      team.player1.nickname.toLowerCase().includes(lower) ||
      team.player2.name.toLowerCase().includes(lower) ||
      team.player2.nickname.toLowerCase().includes(lower)
    );
  };

  const filteredTeams = teams.filter(
    (team) => matchesPlayer(team, search) && matchesPlayer(team, search2)
  );

  return (
    <div className="flex gap-4 p-4">
      <div className="flex flex-col gap-10 w-1/3">

        {/* SEASONS */}
        <div className="border border-ring pb-2 pt-4 px-3 rounded flex flex-col gap-3 max-w-md">
          <div className="flex items-center justify-between rounded pb-1 pt-2 px-1 bg-custom-hover/50">
            <h2 className="font-semibold mb-1">Temporadas</h2>
            <button
              type="button"
              onClick={() => setAddSeasonOpen(true)}
              className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
          </div>
          {seasonsLoading && <LoadingState />}

          {!seasonsLoading && seasons.map((s) => (
            <div key={s.id} className="flex border border-ring/60 items-center justify-end rounded-sm p-2">
              <div className="flex w-full items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Temporada <span className="font-semibold">{s.alias}</span>
                </p>
                <span className="text-muted-foreground text-sm">{formatDate(s.startDate)}</span>
                <span className="text-muted-foreground text-sm">{s.endDate !== null ? formatDate(s.endDate) : "-"}</span>
              </div>
              <SeasonRowMenu
                season={s}
                seasons={seasons}
                seasonMatches={seasonMatchesMap.get(s.id) ?? []}
                seasonMatchesLoading={seasonMatchesLoadingMap.get(s.id) ?? false}
              />
            </div>
          ))}
        </div>

        <SeasonDialog
          open={addSeasonOpen}
          onOpenChange={setAddSeasonOpen}
          mode="create"
          seasons={seasons}
        />

        {/* EDIT PLAYERS */}
        <div className="border border-ring pb-2 pt-4 px-3 rounded flex flex-col gap-4 max-w-md">
          <div className="flex items-center justify-between rounded pb-1 pt-2 px-1 bg-custom-hover/50">
            <h2 className="font-semibold mb-1">Jugadores</h2>
            <button
              type="button"
              onClick={() => setAddPlayerOpen(true)}
              className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
          </div>

          {playersLoading ? (
            <LoadingState />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ring/60">
                  <th className="py-1.5 font-medium text-muted-foreground">Nombre</th>
                  <th className="py-1.5 font-medium text-muted-foreground">Apodo</th>
                  <th className="py-1.5 font-medium text-muted-foreground text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {players.map((p) => (
                  <tr key={p.id} className="border-b border-ring/30 last:border-0">
                    <td className="py-1.5">{p.name}</td>
                    <td className="py-1.5 text-custom-nick">{p.nickname}</td>
                    <td className="py-1.5 text-right">
                      <PlayerRowMenu
                        player={p}
                        matchesPlayed={playerStatsMap.get(p.id)?.matchesPlayed ?? 0}
                        statsLoading={playersStatsLoading}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <PlayerDialog
          open={addPlayerOpen}
          onOpenChange={setAddPlayerOpen}
          mode="create"
        />

      </div>

      <div className="flex flex-col border border-ring rounded px-4 py-2 w-3/5">
        <div className="flex justify-between pt-2 items-center mb-4">
          <div className="flex items-center justify-between rounded pb-2 pt-2 px-1 bg-custom-hover/50 w-1/2">
            <h2 className="font-semibold">Equipos</h2>
            <button
              type="button"
              onClick={() => setAddTeamOpen(true)}
              className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Nombre / Alias"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <span className="text-muted-foreground font-medium">&</span>
            <Input
              placeholder="Nombre / Alias"
              value={search2}
              onChange={(e) => setSearch2(e.target.value)}
              className="w-48"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {teamsLoading ? (
            <LoadingState className="col-span-2" />
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team.id}
                className="border border-ring rounded p-2 flex items-center"
              >
                <div className="flex w-2/5 items-center justify-start">
                  <span className="pr-2 font-medium text-sm">{team.player1.name}</span> 
                  <span className="text-sm text-custom-nick">({team.player1.nickname})</span>
                </div> 
            
                <div className="flex w-2/5 items-center justify-start">
                  <span className="pr-2 font-medium text-sm">{team.player2.name}</span> 
                  <span className="text-sm text-custom-nick">({team.player2.nickname})</span>
                </div>

                <div className="flex w-1/5 items-center justify-end text-sm text-muted-foreground gap-2">
                  {team.seasonsPlayed.map((s) => (
                    <div key={s.id} className="rounded-full border border-custom-hover bg-custom-hover/50 px-1.5">
                      <p className="font-semibold text-accent-foreground/80 text-xs">{s.alias}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <TeamDialog
          open={addTeamOpen}
          onOpenChange={setAddTeamOpen}
          players={players}
          playersLoading={playersLoading}
          teams={teams}
        />
      </div>
    </div>
  );
}
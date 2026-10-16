'use client';

import { useState } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPlayer, createTeam, getMatches, getPlayers, getSeasons, getTeams } from '@/lib/api/api';
import { MatchListItem, Player, Season, Team } from '@/lib/types/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { formatDate } from '../../../lib/helpers';
import SeasonDialog from './season-dialog';
import SeasonRowMenu from './season-row-menu';
import { LoadingState, Spinner } from '@/components/ui/spinner';

export default function ManageClient() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");
  const [search2, setSearch2] = useState<string>("");
  const [addSeasonOpen, setAddSeasonOpen] = useState(false);

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

  const { data: players = [], isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  // CREATE PLAYER
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  const createPlayerMutation = useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setName("");
      setNickname("");
    },
  });

  // CREATE TEAM
  const [player1Id, setPlayer1Id] = useState<string>("");
  const [player2Id, setPlayer2Id] = useState<string>("");

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      setPlayer1Id("");
      setPlayer2Id("");

      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
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

  const handleClearPlayer = () => {
    setName("");
    setNickname("");
  };

  const handleClearTeam = () => {
    setPlayer1Id("");
    setPlayer2Id("");
  };

  const teamExists = (p1: string, p2: string) => {
    return teams.some((t) => {
      return (
        (t.player1.id === p1 && t.player2.id === p2) ||
        (t.player1.id === p2 && t.player2.id === p1)
      );
    });
  };  

  const isDuplicate = player1Id && player2Id && teamExists(player1Id, player2Id) || undefined;

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
                  Temporada <span className="font-semibold">{s.id}</span>
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

        {/* CREATE PLAYER */}
        <div className="border border-ring pb-2 pt-4 px-3 rounded flex flex-col gap-4 max-w-md">
          <div className="rounded pb-1 pt-2 px-1 bg-custom-hover/50">
            <h2 className="font-semibold mb-1">Crear jugador</h2>
          </div>

          <Input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <div className="flex gap-2 justify-end">
            <Button
              className="w-32"
              variant="outline"
              onClick={handleClearPlayer}
              disabled={!name && !nickname}
            >
              Limpiar
            </Button>

            <Button
              className="w-32 gap-1.5"
              disabled={!name || !nickname || createPlayerMutation.isPending}
              onClick={() =>
                createPlayerMutation.mutate({ name, nickname })
              }
            >
              {createPlayerMutation.isPending && <Spinner />}
              Guardar jugador
            </Button>
          </div>
        </div>

        {/* CREATE TEAM */}
        <div className="border border-ring pb-2 pt-4 px-3 rounded flex flex-col gap-4 max-w-md">
          <div className="rounded pb-1 pt-2 px-1 bg-custom-hover/50">
            <h2 className="font-semibold mb-1">Crear equipo</h2>
          </div>

            {/* Player 1 */}
            <Select value={player1Id} onValueChange={setPlayer1Id} disabled={playersLoading}>
              <SelectTrigger className="w-full">
                {playersLoading ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Spinner /> Cargando jugadores...
                  </span>
                ) : (
                  <SelectValue placeholder="Jugador 1" />
                )}
              </SelectTrigger>
              <SelectContent>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nickname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          {/* Player 2 */}
          <Select value={player2Id} onValueChange={setPlayer2Id} disabled={playersLoading}>
            <SelectTrigger className="w-full">
              {playersLoading ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Spinner /> Cargando jugadores...
                </span>
              ) : (
                <SelectValue placeholder="Jugador 2" />
              )}
            </SelectTrigger>
            <SelectContent>
              {players
                .filter((p) => p.id !== player1Id)
                .map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nickname}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 justify-end">
            <Button
              className="w-32"
              variant="outline"
              onClick={handleClearTeam}
              disabled={!player1Id && !player2Id}
            >
              Limpiar
            </Button>

            <Button
              className="w-32 gap-1.5"
              disabled={
                !player1Id ||
                !player2Id ||
                player1Id === player2Id ||
                isDuplicate ||
                createTeamMutation.isPending
              }
              onClick={() => {
                if (player1Id === player2Id) {
                  alert("No puedes seleccionar el mismo jugador");
                  return;
                }

                if (isDuplicate) {
                  alert("Este equipo ya existe");
                  return;
                }

                createTeamMutation.mutate({
                  player1Id,
                  player2Id,
                });
              }}
            >
              {createTeamMutation.isPending && <Spinner />}
              Guardar equipo
            </Button>
          </div>
        </div>

      </div>

      <div className="flex flex-col border border-ring px-4 py-2 w-3/5">
        <div className="flex justify-between pt-2 items-center mb-4">
          <div className="rounded pb-2 pt-2 px-1 bg-custom-hover/50 w-1/2">
            <h2 className="font-semibold">Equipos</h2>
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
        
        <div className="grid grid-cols-3 gap-4">
          {teamsLoading ? (
            <LoadingState className="col-span-3" />
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team.id}
                className="border border-ring rounded p-2 flex flex-col gap-1"
              >
                <div className="flex items-center justify-center">
                  <span className="pr-2 font-medium text-sm">{team.player1.name}</span> 
                  <span className="text-sm text-custom-nick">({team.player1.nickname})</span>
                </div>
            
                <div className="text-center text-muted-foreground">
                  &
                </div>
            
                <div className="flex items-center justify-center">
                  <span className="pr-2 font-medium text-sm">{team.player2.name}</span> 
                  <span className="text-sm text-custom-nick">({team.player2.nickname})</span>
                </div>

                <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
                  {team.seasonsPlayed.map((s) => (
                    <div key={s} className="rounded-full border border-custom-hover bg-custom-hover/50 px-1.5">
                      <p className="font-semibold text-accent-foreground/80 text-xs">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
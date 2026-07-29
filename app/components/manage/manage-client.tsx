'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPlayer, createTeam, getPlayers, getTeams } from '@/lib/api/api';
import { Player, Team } from '@/lib/types/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ManageClient() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");

  const { data: players = [] } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  // --------------------
  // CREATE PLAYER
  // --------------------
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

  // --------------------
  // CREATE TEAM
  // --------------------
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

  const filteredTeams = teams.filter((team) => {
    const text = search.toLowerCase();

    return (
      team.player1.name.toLowerCase().includes(text) ||
      team.player1.nickname.toLowerCase().includes(text) ||
      team.player2.name.toLowerCase().includes(text) ||
      team.player2.nickname.toLowerCase().includes(text)
    );
  });

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
              className="w-32"
              disabled={!name || !nickname}
              onClick={() =>
                createPlayerMutation.mutate({ name, nickname })
              }
            >
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
            <Select value={player1Id} onValueChange={setPlayer1Id}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jugador 1" />
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
          <Select value={player2Id} onValueChange={setPlayer2Id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Jugador 2" />
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
              className="w-32"
              disabled={!player1Id || !player2Id || player1Id === player2Id || isDuplicate}
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
              Guardar equipo
            </Button>
          </div>
        </div>

      </div>

      <div className="flex flex-col border border-ring px-4 py-2 w-2/3">
        <div className="flex justify-between pt-2 items-center mb-4">
          <div className="rounded pb-2 pt-2 px-1 bg-custom-hover/50 w-3/5">
            <h2 className="font-semibold">Equipos</h2>
          </div>

          <Input
            placeholder="Buscar por nombre o nickname..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {teamsLoading ? (
            <span>Cargando...</span>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
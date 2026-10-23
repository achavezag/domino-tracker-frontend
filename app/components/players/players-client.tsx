'use client';

import { getHeadToHead, getPlayers, getPlayersStats } from '@/lib/api/api';
import { useQuery } from '@tanstack/react-query';
import { HeadToHeadStats, Player, PlayerStats } from '@/lib/types/types';
import PlayerCard from './player-card';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/spinner';
import { useSeasonStore } from '@/lib/store/season-store';
import ViewModeSwitch from '../view-mode-switch';

export default function PlayersClient() {
  const [mode, setMode] = useState<"all" | "headtohead">("all");

  const [player1Id, setPlayer1Id] = useState<string>("");
  const [player2Id, setPlayer2Id] = useState<string>("");

  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data: players = [], isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const { data: playerStats = [], isLoading: playerStatsLoading } = useQuery<PlayerStats[]>({
    queryKey: ["players-stats", selectedSeasonIds],
    queryFn: () => getPlayersStats(selectedSeasonIds),
  });

  const { data: headToHead, isFetching: headToHeadLoading } = useQuery<HeadToHeadStats>({
    queryKey: ["headtohead", player1Id, player2Id, selectedSeasonIds],
    queryFn: () => getHeadToHead(player1Id, player2Id, selectedSeasonIds),
    enabled:
      !!player1Id &&
      !!player2Id &&
      player1Id !== player2Id,
    });

  const selectedPlayer1 = players.find(
    (p) => p.id === player1Id
  );

  const selectedPlayer2 = players.find(
    (p) => p.id === player2Id
  );

  const selectedStats1 = playerStats.find(
    (s) => s.playerId === player1Id
  );

  const selectedStats2 = playerStats.find(
    (s) => s.playerId === player2Id
  );

  const statsMap = new Map(
    playerStats.map((s) => [s.playerId, s])
  );

  const handleClear = () => {
    setPlayer1Id("");
    setPlayer2Id("");
  };

  const sortedPlayers = [...players]
    .filter((p) => (statsMap.get(p.id)?.matchesPlayed ?? 0) > 0)
    .sort((a, b) => {
      const statsA = statsMap.get(a.id);
      const statsB = statsMap.get(b.id);

      return (statsB?.winRate ?? 0) - (statsA?.winRate ?? 0);
    });

  if (playersLoading || playerStatsLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2 border-b border-ring p-4">

        {/* MODES */}
        <div className="flex w-full items-center justify-between">

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mode === "all"}
                onChange={() => setMode("all")}
              />
              <span className="text-sm">Todos</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mode === "headtohead"}
                onChange={() => setMode("headtohead")}
              />
              <span className="text-sm">Cara a cara</span>
            </label>
          </div>

          {/* SELECTS */}
          {mode === "headtohead" && (
            <div className="h-6 flex items-center gap-4">

              {/* PLAYER 1 */}
              <Select
                value={player1Id}
                onValueChange={setPlayer1Id}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Jugador 1" />
                </SelectTrigger>

                <SelectContent>
                  {players.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      disabled={p.id === player2Id}
                    >
                      {p.nickname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* PLAYER 2 */}
              <Select
                value={player2Id}
                onValueChange={setPlayer2Id}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Jugador 2" />
                </SelectTrigger>

                <SelectContent>
                  {players.map((p) => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      disabled={p.id === player1Id}
                    >
                      {p.nickname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* LIMPIAR */}
              <Button
                variant="outline"
                className="w-32"
                onClick={handleClear}
                disabled={!player1Id && !player2Id}
              >
                Limpiar
              </Button>

            </div>
          )}
          
          <div className="pr-28">
            <ViewModeSwitch />
          </div>         

        </div>        
      </div>  

      {mode === "all" && (
        <div className='grid lg:grid-cols-4 md:grid-cols-3 gap-6 pr-2 pb-2'>
          {sortedPlayers.map((player) => {
            const stats = statsMap.get(player.id);
            return (
              <PlayerCard
                key={player.id}
                player={player}
                stats={stats}
              />
            );
          })}
        </div>
      )}

      {mode === "headtohead" && (
        <div className="flex items-center justify-center gap-28 w-full min-h-125 pb-2">

          {/* LEFT PLAYER */}
          <div className="">
            {selectedPlayer1 && selectedStats1 && (
              <PlayerCard
                player={selectedPlayer1}
                stats={selectedStats1}
              />
            )}
          </div>

          {/* CENTER */}
          <div className="w-[320px]">
            {headToHeadLoading && <LoadingState />}

            {!headToHeadLoading && headToHead && (
              <div className="border border-ring rounded-xl px-6 py-4 w-full bg-card">

                <h2 className="text-center font-bold text-lg mb-2">
                  Cara a cara
                </h2>

                <div className="space-y-4">

                  {/* MATCHES */}
                  <div className="border border-ring/75 rounded-lg p-2">
                    <div className="flex justify-center text-sm text-muted-foreground mb-1">
                      Total partidos
                    </div>

                    <div className="flex items-center justify-between px-2 text-lg font-bold">
                      <span>{headToHead.player1Wins}</span>
                      <span>{headToHead.player2Wins}</span>
                    </div>
                  </div>

                  {/* ROTATING MATCHES */}
                  <div className="border border-ring/75 rounded-lg p-2">
                    <div className="flex justify-center text-sm text-muted-foreground mb-1">
                      Partidos rotativos
                    </div>

                    <div className="flex items-center justify-between px-2 text-lg font-bold">
                      <span>{headToHead.player1Wins - headToHead.player1WarMatchWins}</span>
                      <span>{headToHead.player2Wins - headToHead.player2WarMatchWins}</span>
                    </div>
                  </div>
                  
                  {/* WAR MATCHES */}
                  <div className="border border-ring/75 rounded-lg p-2">
                    <div className="flex justify-center text-sm text-muted-foreground mb-1">
                      Partidos de guerras
                    </div>

                    <div className="flex items-center justify-between px-2 text-lg font-bold">
                      <span>{headToHead.player1WarMatchWins}</span>
                      <span>{headToHead.player2WarMatchWins}</span>
                    </div>
                  </div>

                  {/* WARS */}
                  <div className="border border-ring/75 rounded-lg p-2">
                    <div className="flex justify-center text-sm text-muted-foreground mb-1">
                      Guerras
                    </div>

                    <div className="flex items-center justify-between px-2 text-lg font-bold">
                      <span>{headToHead.player1WarWins}</span>
                      <span>{headToHead.player2WarWins}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* RIGHT PLAYER */}
          <div className="">
            {selectedPlayer2 && selectedStats2 && (
              <PlayerCard
                player={selectedPlayer2}
                stats={selectedStats2}
              />
            )}
          </div>

        </div>
      )}

    </>
  );
}
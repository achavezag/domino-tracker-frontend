'use client';

import { getHeadToHead, getPlayers, getPlayersStats } from '@/lib/api/api';
import { useQuery } from '@tanstack/react-query';
import { HeadToHeadStats, Player, PlayerStats } from '@/lib/types/types';
import PlayerCard from './player-card';
import { useState } from 'react';
import { Eraser } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
      <div className="sticky top-0 z-10 -mt-0.5 bg-background flex items-center justify-between mb-2 px-1 md:static md:mt-0 md:pt-0">

        {/* MODES — DESKTOP */}
        <div className="hidden w-full items-center gap-2 justify-between border-b border-ring p-3 md:flex">

          <div className="flex h-6 items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mode === "all"}
                onChange={() => setMode("all")}
                className="accent-custom-win"
              />
              <span className="text-sm text-shadow-2xs">Todos</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mode === "headtohead"}
                onChange={() => setMode("headtohead")}
                className="accent-custom-win"
              />
              <span className="text-sm text-shadow-2xs">Cara a cara</span>
            </label>
          </div>

          {/* SELECTS */}
          {mode === "headtohead" && (
            <div className="flex h-6 items-center gap-4">

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

          <div className="pr-20">
            <ViewModeSwitch />
          </div>

        </div>

        {/* MODES — MOBILE */}
        <div className="flex w-full flex-col gap-2 border-b border-ring p-3 md:hidden">

          {/* ROW 1: RADIOS + SWITCH */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={mode === "all"}
                  onChange={() => setMode("all")}
                  className="accent-custom-win"
                />
                <span className="text-sm text-shadow-2xs">Todos</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={mode === "headtohead"}
                  onChange={() => setMode("headtohead")}
                  className="accent-custom-win"
                />
                <span className="text-sm text-shadow-2xs">Cara a cara</span>
              </label>
            </div>

            <ViewModeSwitch />
          </div>

          {/* ROW 2: SELECTS + LIMPIAR */}
          {mode === "headtohead" && (
            <div className="flex items-center justify-between gap-2">

              <div className="flex gap-1 items-center justify-between w-11/12">
              {/* PLAYER 1 */}
              <Select
                value={player1Id}
                onValueChange={setPlayer1Id}
              >
                <SelectTrigger className="w-32">
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
                <SelectTrigger className="w-32">
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
              </div>

              {/* LIMPIAR */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-10 px-2 border border-ring"
                    onClick={handleClear}
                    disabled={!player1Id && !player2Id}
                  >
                    <Eraser className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Limpiar</TooltipContent>
              </Tooltip>

            </div>
          )}

        </div>
      </div>

      {mode === "all" && (
        <div className='grid justify-items-center gap-6 pr-2 pb-2 md:grid-cols-3 md:justify-items-stretch lg:grid-cols-4'>
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
        <>
          {/* DESKTOP */}
          <div className="hidden md:flex items-center justify-center gap-28 w-full min-h-125 pb-2">

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
                        Partidos fijos
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

          {/* MOBILE */}
          <div className="flex md:hidden flex-col items-center gap-4 w-full pb-4">

            {/* TOP PLAYER */}
            {selectedPlayer1 && selectedStats1 && (
              <PlayerCard
                player={selectedPlayer1}
                stats={selectedStats1}
              />
            )}

            {/* STATS */}
            {headToHeadLoading && <LoadingState />}

            {!headToHeadLoading && headToHead && (
              <div className="flex items-center justify-center gap-2">
                {[
                  { label: "T", v1: headToHead.player1Wins, v2: headToHead.player2Wins },
                  { label: "PR", v1: headToHead.player1Wins - headToHead.player1WarMatchWins, v2: headToHead.player2Wins - headToHead.player2WarMatchWins },
                  { label: "PF", v1: headToHead.player1WarMatchWins, v2: headToHead.player2WarMatchWins },
                  { label: "G", v1: headToHead.player1WarWins, v2: headToHead.player2WarWins },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex w-14 flex-col items-center justify-between gap-2 rounded-2xl border border-ring/75 bg-card px-1 py-3"
                  >
                    <span className="text-sm font-bold">{stat.v1}</span>
                    <span className="font-semibold text-sm text-muted-foreground">{stat.label}</span>
                    <span className="text-sm font-bold">{stat.v2}</span>
                  </div>
                ))}
              </div>
            )}

            {/* BOTTOM PLAYER */}
            {selectedPlayer2 && selectedStats2 && (
              <PlayerCard
                player={selectedPlayer2}
                stats={selectedStats2}
              />
            )}

          </div>
        </>
      )}

    </>
  );
}
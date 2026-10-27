'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentSeason, getTeams } from "@/lib/api/api";
import { Season, Team } from "@/lib/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toDateInputValue } from "@/lib/helpers";
import { Spinner } from "@/components/ui/spinner";

const today = toDateInputValue(new Date());

export default function PlayClient() {
  const router = useRouter();

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const [date, setDate] = useState<string>(today);

  const { data: currentSeason, error: seasonError, isFetching: seasonLoading } = useQuery<Season>({
    queryKey: ["season", date],
    queryFn: () => getCurrentSeason(date),
  });

  const [teamAId, setTeamAId] = useState<string>("");
  const [teamBId, setTeamBId] = useState<string>("");
  const [type, setType] = useState<"Fixed" | "Rotating">("Fixed");

  const sameTeam = teamAId === teamBId;
  const selectedTeamA = teams.find((t) => t.id === teamAId);
  const selectedTeamB = teams.find((t) => t.id === teamBId);

  const hasSharedPlayers = (team1: Team, team2: Team) => {
    const team1Players = [team1.player1.id, team1.player2.id];
    const team2Players = [team2.player1.id, team2.player2.id];

    return team1Players.some((p) => team2Players.includes(p));
  };

  const handleTeamAChange = (value: string) => {
    setTeamAId(value);
  };

  const handleTeamBChange = (value: string) => {
    setTeamBId(value);
  };

  const handleClear = () => {
    setTeamAId("");
    setTeamBId("");
    setType("Fixed");
  };

  const hasConflict = selectedTeamA && selectedTeamB && hasSharedPlayers(selectedTeamA, selectedTeamB);

  return (
    <div className="border border-ring pb-2 pt-4 px-3 rounded flex flex-col gap-4 max-w-md">
      <div className="rounded pb-1 pt-2 px-1 bg-custom-hover/50">
        <h2 className="font-semibold mb-1">Crear juego</h2>
      </div>

      {/* DATE */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center px-2">
          <p className="text-sm text-gray-500">Temporada</p>
          {seasonLoading ? (
            <Spinner />
          ) : seasonError ? (
            <p className="text-sm text-custom-lose">Sin temporada</p>
          ) : (
            <div className="rounded-full border border-custom-hover bg-custom-hover/50 px-2">
              <p className="font-semibold text-accent-foreground/80">{currentSeason?.alias}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center justify-end">
          <span className="text-sm text-muted-foreground">Fecha</span>
          <Input
            className="h-8 w-36 md:w-40 text-xs md:text-sm"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* TEAM A */}
      <Select value={teamAId} onValueChange={handleTeamAChange} disabled={teamsLoading}>
        <SelectTrigger className="w-full">
          {teamsLoading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Spinner /> Cargando equipos...
            </span>
          ) : (
            <SelectValue placeholder="Equipo A" />
          )}
        </SelectTrigger>
        <SelectContent>
          {teams.map((t) => {
            const isInvalid =
              selectedTeamB && hasSharedPlayers(t, selectedTeamB);
          
            return (
              <SelectItem
                key={t.id}
                value={t.id}
                disabled={isInvalid}
              >
                {t.player1.nickname} / {t.player2.nickname}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* TEAM B */}
      <Select value={teamBId} onValueChange={handleTeamBChange} disabled={teamsLoading}>
        <SelectTrigger className="w-full">
          {teamsLoading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Spinner /> Cargando equipos...
            </span>
          ) : (
            <SelectValue placeholder="Equipo B" />
          )}
        </SelectTrigger>
        <SelectContent>
          {teams.map((t) => {
            const isInvalid =
              selectedTeamA && hasSharedPlayers(t, selectedTeamA);
          
            return (
              <SelectItem
                key={t.id}
                value={t.id}
                disabled={isInvalid}
              >
                {t.player1.nickname} / {t.player2.nickname}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* MATCH TYPE */}
      <Select value={type} onValueChange={(v: "Fixed" | "Rotating") => setType(v)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Tipo de partido" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Fixed">Fijo</SelectItem>
          <SelectItem value="Rotating">Rotativo</SelectItem>
        </SelectContent>
      </Select>

      {/* BUTTONS */} 
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          className="w-32"
          onClick={handleClear}
          disabled={!teamAId && !teamBId}
        >
          Limpiar
        </Button>

        <Button
          className="w-32"
          disabled={
            teamsLoading ||
            seasonLoading ||
            !teamAId ||
            !teamBId ||
            sameTeam ||
            hasConflict ||
            !date ||
            !!seasonError
          }
          onClick={() => {
            if (!selectedTeamA || !selectedTeamB) return;

            const params = new URLSearchParams({
              teamA: JSON.stringify(selectedTeamA),
              teamB: JSON.stringify(selectedTeamB),
              type,
              date,
            });

            router.push(`/play/match?${params.toString()}`);
          }}
        >
          Iniciar partido
        </Button>
      </div>
    </div>    
  );
}
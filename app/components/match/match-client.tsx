'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMatch, getMatchHistory, createWar } from '@/lib/api/api';
import { MatchDetail, MatchHistoryItem, MatchType, Team } from '@/lib/types/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDate, toDateInputValue } from '@/lib/helpers';
import { LoadingState, Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export default function MatchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const teamA: Team = JSON.parse(
    searchParams.get("teamA") || "{}"
  );

  const teamB: Team = JSON.parse(
    searchParams.get("teamB") || "{}"
  );

  const type = (searchParams.get("type") as MatchType) || "Fixed";
  const date = searchParams.get("date") || toDateInputValue(new Date());

  const [pointsA, setPointsA] = useState<string>("");
  const [pointsB, setPointsB] = useState<string>("");

  const [createdMatch, setCreatedMatch] = useState<MatchDetail | null>(null);

  const { data: history = [], isLoading: historyLoading } = useQuery<MatchHistoryItem[]>({
    queryKey: ["match-history", teamA.id, teamB.id, type, date],
    queryFn: () => getMatchHistory(teamA.id, teamB.id, type, date),
    enabled: !!teamA.id && !!teamB.id,
  });

  const createMatchMutation = useMutation({
    mutationFn: createMatch,

    onSuccess: async (data) => {
      setCreatedMatch(data);

      setPointsA("");
      setPointsB("");

      await queryClient.invalidateQueries({
        queryKey: ["match-history", teamA.id, teamB.id],
      });

      toast.success("Partido guardado");
    },

    onError: (err: unknown) => {
      let message = "Error creando partido";

      if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
    },
  });

  const saveWarMutation = useMutation({
    mutationFn: createWar,

    onSuccess: async () => {
      toast.success("Guerra guardada correctamente");

      queryClient.invalidateQueries({
        queryKey: ["wars"],
      });
    },

    onError: (err: unknown) => {
      let message = "Error inesperado";

      if (err instanceof Error) {
        message = err.message;
      }

      if (message.includes("misma guerra")) {
        toast.error("Los partidos no corresponden a la misma guerra");
      } else if (message.includes("no se enviaron")) {
        toast.warning("No hay partidos seleccionados");
      } else {
        toast.error(message);
      }
    },
  });

  const processedHistory = (() => {
    let winsA = 0;
    let winsB = 0;

    return history.map((m) => {
      const isSameOrder =
        m.teamAId === teamA.id &&
        m.teamBId === teamB.id;

      const scoreA = isSameOrder
        ? m.teamAScore
        : m.teamBScore;

      const scoreB = isSameOrder
        ? m.teamBScore
        : m.teamAScore;

      const isWinA = scoreA > scoreB;
      const isWinB = scoreA < scoreB;

      if (isWinA) winsA++;
      if (isWinB) winsB++;

      return { match: m, scoreA, scoreB, isWinA, isWinB, winsA, winsB };
    });
  })();

  const dayWinsA = processedHistory.length > 0
    ? processedHistory[processedHistory.length - 1].winsA
    : 0;

  const dayWinsB = processedHistory.length > 0
    ? processedHistory[processedHistory.length - 1].winsB
    : 0;

  const allMatchIds = Array.from(
    new Set([
      ...history.map((m) => m.id),
      ...(createdMatch ? [createdMatch.id] : []),
    ])
  );

  const handleNextMatch = async () => {
    setCreatedMatch(null);
    setPointsA("");
    setPointsB("");

    await queryClient.invalidateQueries({
      queryKey: ["match-history", teamA.id, teamB.id],
    });
  };

  const handleSaveWar = () => {
    saveWarMutation.mutate(allMatchIds);
  };

  const canSaveWar = createdMatch && allMatchIds.length > 0;
  
  if (!teamA?.id || !teamB?.id) {
    return (
      <div className="p-4">
        Datos del partido inválidos
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-2 max-w-xl">

      {/* DATE + TYPE */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{formatDate(date)}</span>
        <span>•</span>
        <span className={type === "Fixed" ? "font-medium text-custom-fixed" : "font-medium text-custom-rotating"}>
          {type === "Fixed" ? "Fijo" : "Rotativo"}
        </span>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center text-lg font-bold border-b pb-2">

        <span>
          {teamA.player1.nickname} / {teamA.player2.nickname}
        </span>

        <span className="text-xl">
          {dayWinsA} - {dayWinsB}
        </span>

        <span>
          {teamB.player1.nickname} / {teamB.player2.nickname}
        </span>

      </div>

      {/* DAY HISTORY */}
      {historyLoading && <LoadingState label="Cargando historial..." />}

      {!historyLoading && processedHistory.length > 0 && (
        <div className="border rounded p-2 text-sm bg-muted/30">

          {processedHistory.map(({ match: m, scoreA, scoreB, isWinA, isWinB, winsA, winsB }) => (
            <div
              key={m.id}
              className="flex items-center justify-between text-sm"
            >

              <span
                className={cn(
                  "inline-flex items-center justify-center w-4 h-4 rounded-full border text-xs transition-colors",
                  isWinA
                    ? "border-custom-win bg-custom-win/15 text-custom-win font-bold scale-110"
                    : "border-custom-avg text-custom-avg"
                )}
              >
                {winsA}
              </span>

              <span className="w-1/3 text-center font-semibold">
                <span className={isWinA ? "text-custom-win" : "text-custom-lose"}>
                  {scoreA}
                </span>

                <span className="px-2">-</span>

                <span className={!isWinA ? "text-custom-win" : "text-custom-lose"}>
                  {scoreB}
                </span>
              </span>

              <span
                className={cn(
                  "inline-flex items-center justify-center w-4 h-4 rounded-full border text-xs transition-colors",
                  isWinB
                    ? "border-custom-win bg-custom-win/15 text-custom-win font-bold scale-110"
                    : "border-custom-avg text-custom-avg"
                )}
              >
                {winsB}
              </span>

            </div>
          ))}

        </div>
      )}

      {/* FINAL SCORE */}
      {!createdMatch && (
        <div className="h-12 flex items-center justify-between border rounded px-2 py-2">

          {/* TEAM A */}
          <div className="w-1/3 flex justify-center">
            <Input
              className="h-8 w-12 md:w-20 text-center md:pl-6"
              type="number"
              value={pointsA}
              onChange={(e) => setPointsA(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* DASH */}
          <div className="w-1/3 text-center font-semibold">
            -
          </div>

          {/* TEAM B */}
          <div className="w-1/3 flex justify-center">
            <Input
              className="h-8 w-12 md:w-20 text-center md:pl-6"
              type="number"
              value={pointsB}
              onChange={(e) => setPointsB(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* BUTTON */}
          <Button
            className="h-8 flex items-center justify-center gap-1.5 ml-4"
            disabled={!pointsA || !pointsB || createMatchMutation.isPending}
            onClick={() => {
              createMatchMutation.mutate({
                teamAId: teamA.id,
                teamBId: teamB.id,
                type,
                teamAScore: Number(pointsA),
                teamBScore: Number(pointsB),
                date,
              });
            }}
          >
            {createMatchMutation.isPending && <Spinner />}
            Guardar
          </Button>

        </div>
      )}

      {/* ACTIONS */}
      {createdMatch && (
        <>
          {type === "Fixed" ? (
            <Button
              className="mt-4"
              onClick={handleNextMatch}
            >
              Siguiente partido
            </Button>
          ) : (
            <>
              <Button
                className="mt-4"
                onClick={handleNextMatch}
              >
                ReMatch (mismas parejas)
              </Button>

              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  router.push("/play");
                }}
              >
                Nuevo enfrentamiento
              </Button>
            </>  
          )}
          
          {type === "Fixed" && (
            <Button
              variant="outline"
              className="mt-2 gap-1.5"
              onClick={handleSaveWar}
              disabled={saveWarMutation.isPending || !canSaveWar}
            >
              {saveWarMutation.isPending && <Spinner />}
              {saveWarMutation.isPending
                ? "Guardando..."
                : "Guardar guerra"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
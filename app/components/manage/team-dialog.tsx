'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTeam } from '@/lib/api/api';
import { Player, Team } from '@/lib/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  playersLoading?: boolean;
  teams: Team[];
};

export default function TeamDialog({
  open,
  onOpenChange,
  players,
  playersLoading = false,
  teams,
}: Props) {
  const queryClient = useQueryClient();

  const [player1Id, setPlayer1Id] = useState<string>("");
  const [player2Id, setPlayer2Id] = useState<string>("");

  useEffect(() => {
    if (open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlayer1Id("");
    setPlayer2Id("");
  }, [open]);

  const teamExists = (p1: string, p2: string) => {
    return teams.some((t) => {
      return (
        (t.player1.id === p1 && t.player2.id === p2) ||
        (t.player1.id === p2 && t.player2.id === p1)
      );
    });
  };

  const isDuplicate = !!player1Id && !!player2Id && teamExists(player1Id, player2Id);

  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Equipo creado");
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error creando equipo");
    },
  });

  const canSubmit = !!player1Id && !!player2Id && player1Id !== player2Id && !isDuplicate;

  const handleSubmit = () => {
    if (!canSubmit) return;

    createMutation.mutate({ player1Id, player2Id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar equipo</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para crear un equipo
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
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

          {isDuplicate && (
            <p className="text-sm text-custom-lose">
              Este equipo ya existe.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            className="gap-1.5"
            disabled={!canSubmit || createMutation.isPending}
            onClick={handleSubmit}
          >
            {createMutation.isPending && <Spinner />}
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

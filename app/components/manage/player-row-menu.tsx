'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePlayer } from '@/lib/api/api';
import { Player } from '@/lib/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Spinner } from '@/components/ui/spinner';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import PlayerDialog from './player-dialog';

type Props = {
  player: Player;
  matchesPlayed: number;
  statsLoading?: boolean;
};

export default function PlayerRowMenu({
  player,
  matchesPlayed,
  statsLoading = false,
}: Props) {
  const queryClient = useQueryClient();
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasMatches = matchesPlayed > 0;

  const deleteMutation = useMutation({
    mutationFn: () => deletePlayer(player.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["players-stats"] });
      toast.success("Jugador eliminado");
      setDeleteOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error eliminando jugador");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground">
          {statsLoading ? (
            <Spinner />
          ) : (
            <MoreVertical className="size-4" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setViewOpen(true)}>
            Ver
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            disabled={hasMatches || statsLoading || deleteMutation.isPending}
            onSelect={() => setDeleteOpen(true)}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PlayerDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        mode="view"
        player={player}
      />

      <PlayerDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        player={player}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Eliminar a ${player.nickname}`}
        description={
          hasMatches
            ? "Este jugador tiene partidos jugados en la temporada seleccionada y no puede eliminarse."
            : "Esta acción no se puede deshacer. ¿Seguro que quieres eliminar este jugador?"
        }
        confirmLabel="Eliminar"
        pendingLabel="Eliminando..."
        variant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}

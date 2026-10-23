'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSeason } from '@/lib/api/api';
import { MatchListItem, Season } from '@/lib/types/types';
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
import SeasonDialog from './season-dialog';

type Props = {
  season: Season;
  seasons: Season[];
  seasonMatches: MatchListItem[];
  seasonMatchesLoading?: boolean;
};

export default function SeasonRowMenu({
  season,
  seasons,
  seasonMatches,
  seasonMatchesLoading = false,
}: Props) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasMatches = seasonMatches.length > 0;

  const deleteMutation = useMutation({
    mutationFn: () => deleteSeason(season.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      toast.success("Temporada eliminada");
      setDeleteOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error eliminando temporada");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground">
          {seasonMatchesLoading ? (
            <Spinner />
          ) : (
            <MoreVertical className="size-4" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            disabled={hasMatches || seasonMatchesLoading || deleteMutation.isPending}
            onSelect={() => setDeleteOpen(true)}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SeasonDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        season={season}
        seasons={seasons}
        seasonMatches={seasonMatches}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Eliminar Temporada ${season.alias}`}
        description="Esta acción no se puede deshacer. ¿Seguro que quieres eliminar esta temporada? Las temporadas posteriores se renumerarán."
        confirmLabel="Eliminar"
        pendingLabel="Eliminando..."
        variant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}

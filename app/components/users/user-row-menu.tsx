'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '@/lib/api/api';
import { AppUser } from '@/lib/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import UserDialog from './user-dialog';

type Props = {
  user: AppUser;
};

export default function UserRowMenu({ user }: Props) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario eliminado");
      setDeleteOpen(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error eliminando usuario");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground">
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            disabled={deleteMutation.isPending}
            onSelect={() => setDeleteOpen(true)}
          >
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDialog open={editOpen} onOpenChange={setEditOpen} mode="edit" user={user} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Eliminar a ${user.username}`}
        description="Esta acción no se puede deshacer. ¿Seguro que quieres eliminar este usuario?"
        confirmLabel="Eliminar"
        pendingLabel="Eliminando..."
        variant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
      />
    </>
  );
}

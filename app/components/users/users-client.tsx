'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/api';
import { AppUser } from '@/lib/types/types';
import { Plus } from 'lucide-react';
import { LoadingState } from '@/components/ui/spinner';
import UserDialog from './user-dialog';
import UserRowMenu from './user-row-menu';

export default function UsersClient() {
  const [addOpen, setAddOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<AppUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="p-4">
      <div className="border border-ring pb-2 pt-4 px-3 rounded flex flex-col gap-4 max-w-2xl">
        <div className="flex items-center justify-between rounded pb-1 pt-2 px-1 bg-custom-hover/50">
          <h2 className="font-semibold mb-1">Usuarios</h2>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-ring/60">
                <th className="py-1.5 font-medium text-muted-foreground">Usuario</th>
                <th className="py-1.5 font-medium text-muted-foreground">Rol</th>
                <th className="py-1.5 font-medium text-muted-foreground">Sesión</th>
                <th className="py-1.5 font-medium text-muted-foreground text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ring/30 last:border-0">
                  <td className="py-1.5">{u.username}</td>
                  <td className="py-1.5 text-custom-nick">{u.roleName}</td>
                  <td className="py-1.5 text-muted-foreground">{u.sessionName ?? "-"}</td>
                  <td className="py-1.5 text-right">
                    <UserRowMenu user={u} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserDialog open={addOpen} onOpenChange={setAddOpen} mode="create" />
    </div>
  );
}

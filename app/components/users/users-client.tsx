'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/lib/api/api';
import { AppUser, Role } from '@/lib/types/types';
import { Crown, Plus, Settings, Shield, User as UserIcon } from 'lucide-react';
import { LoadingState } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserDialog from './user-dialog';
import UserRowMenu from './user-row-menu';

const roleIcons: Record<Role, typeof Crown> = {
  super_admin: Crown,
  session_admin: Shield,
  user: UserIcon,
};

export default function UsersClient() {
  const [addOpen, setAddOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<AppUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="py-2">
      <div className="border border-ring pb-2 pt-4 px-2 rounded flex flex-col gap-4 max-w-2xl">
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
                <th className="pl-1.5 py-1.5 font-medium text-muted-foreground">Sesión</th>
                <th className="py-1.5 font-medium text-muted-foreground text-right">
                  <span className="hidden md:inline">Acciones</span>
                  <Tooltip>
                    <TooltipTrigger className="md:hidden inline-flex">
                      <Settings className="mr-0.5 size-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Acciones</TooltipContent>
                  </Tooltip>
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => {
                const RoleIcon = roleIcons[u.roleName];

                return (
                  <tr key={u.id} className="border-b border-ring/30 last:border-0">
                    <td className="py-1.5">{u.username}</td>
                    <td className="py-1.5 text-custom-nick">
                      <span className="hidden md:inline">{u.roleName}</span>
                      <Tooltip>
                        <TooltipTrigger className="md:hidden inline-flex">
                          <RoleIcon className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent>{u.roleName}</TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="pl-1.5 py-1.5 text-muted-foreground">{u.sessionName ?? "-"}</td>
                    <td className="py-1.5 text-right">
                      <UserRowMenu user={u} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <UserDialog open={addOpen} onOpenChange={setAddOpen} mode="create" />
    </div>
  );
}

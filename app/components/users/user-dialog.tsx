'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getRoles, getSessions, updateUser } from '@/lib/api/api';
import { AppUser, RoleOption, Session } from '@/lib/types/types';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: AppUser;
};

export default function UserDialog({ open, onOpenChange, mode, user }: Props) {
  const queryClient = useQueryClient();
  const isCreate = mode === "create";

  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [password, setPassword] = useState<string>("");
  const [roleId, setRoleId] = useState<string>(user ? String(user.roleId) : "");
  const [sessionId, setSessionId] = useState<string>(user?.sessionId ? String(user.sessionId) : "");

  const { data: roles = [], isLoading: rolesLoading } = useQuery<RoleOption[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: open,
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: getSessions,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsername(user?.username ?? "");
    setPassword("");
    setRoleId(user ? String(user.roleId) : "");
    setSessionId(user?.sessionId ? String(user.sessionId) : "");
  }, [open, user]);

  const selectedRole = roles.find((r) => String(r.id) === roleId);
  const isSuperAdminRole = selectedRole?.name === "super_admin";

  const createMutation = useMutation({
    mutationFn: () =>
      createUser({
        username: username.trim(),
        password,
        roleId: Number(roleId),
        sessionId: isSuperAdminRole ? null : Number(sessionId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario creado");
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error creando usuario");
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateUser(user!.id, {
        username: username.trim(),
        password: password || undefined,
        roleId: Number(roleId),
        sessionId: isSuperAdminRole ? null : Number(sessionId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuario actualizado");
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error actualizando usuario");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const canSubmit =
    !!username.trim() &&
    (isCreate ? !!password : true) &&
    !!roleId &&
    (isSuperAdminRole || !!sessionId);

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (isCreate) {
      createMutation.mutate();
    } else {
      updateMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreate ? "Agregar usuario" : "Editar usuario"}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {isCreate ? "crear" : "editar"} un usuario
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Usuario</span>
            <Input
              className="h-8 w-52"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">
              {isCreate ? "Contraseña" : "Nueva contraseña"}
            </span>
            <Input
              className="h-8 w-52"
              type="password"
              placeholder={isCreate ? "" : "Dejar en blanco para no cambiar"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Rol</span>
            <Select value={roleId} onValueChange={setRoleId} disabled={rolesLoading}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isSuperAdminRole && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Sesión</span>
              <Select value={sessionId} onValueChange={setSessionId} disabled={sessionsLoading}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Selecciona una sesión" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>

          <Button className="gap-1.5" disabled={!canSubmit || isPending} onClick={handleSubmit}>
            {isPending && <Spinner />}
            {isCreate ? "Agregar" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

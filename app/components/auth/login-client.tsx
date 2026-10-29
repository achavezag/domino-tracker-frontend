'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/api/api';
import { Role } from '@/lib/types/types';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super administrador",
  session_admin: "Administrador de sesión",
  user: "Usuario",
};

export default function LoginClient() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [sessionName, setSessionName] = useState("");

  useEffect(() => {
    if (hasHydrated && token) router.replace("/");
  }, [hasHydrated, token, router]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data);
      router.replace("/");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error iniciando sesión");
    },
  });

  const needsSessionName = role !== "super_admin";
  const canSubmit = !!username.trim() && !!password && (!needsSessionName || !!sessionName.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;

    loginMutation.mutate({
      username: username.trim(),
      password,
      role,
      sessionName: needsSessionName ? sessionName.trim() : undefined,
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-semibold text-shadow-2xs">Domino</CardTitle>
          <CardDescription>Inicia sesión para continuar</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Usuario</span>
              <Input
                className="text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Contraseña</span>
              <Input
                className="text-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-muted-foreground">Rol</span>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsSessionName && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm text-muted-foreground">Sesión</span>
                <Input
                  className="text-sm"
                  placeholder="Nombre de la sesión"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
            )}

            <Button
              className="mt-2 w-full gap-1.5"
              disabled={!canSubmit || loginMutation.isPending}
              onClick={handleSubmit}
            >
              {loginMutation.isPending && <Spinner />}
              Iniciar sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

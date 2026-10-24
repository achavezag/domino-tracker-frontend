'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSession, getSessions } from '@/lib/api/api';
import { Session } from '@/lib/types/types';
import { useSessionStore } from '@/lib/store/session-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function SessionSelector() {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const authSessionName = useAuthStore((s) => s.sessionName);
  const isSuperAdmin = role === "super_admin";

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: getSessions,
    enabled: isSuperAdmin,
  });

  const sessionId = useSessionStore((s) => s.sessionId);
  const setSessionId = useSessionStore((s) => s.setSessionId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setSessionId(session.id);
      queryClient.clear();
      setNewSessionName("");
      setCreateOpen(false);
      toast.success("Sesión creada correctamente");
      router.push("/");
    },
    onError: (err: unknown) => {
      let message = "Error creando sesión";

      if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
    },
  });

  const handleSelect = (id: number) => {
    if (id !== sessionId) {
      setSessionId(id);
      queryClient.clear();
      router.push("/");
    }

    setOpen(false);
  };

  const current = sessions.find((s) => s.id === sessionId);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col gap-1 w-full px-2">
        <span className="text-xs text-muted-foreground">Sesión</span>
        <div className="truncate border rounded px-2 py-1 text-sm text-muted-foreground" title={authSessionName ?? undefined}>
          {authSessionName ?? "-"}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1 w-full px-2">
      <span className="text-xs text-muted-foreground">Sesión</span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          disabled={isLoading}
          className="flex-1 truncate border rounded px-2 py-1 text-left text-sm hover:bg-ring/10 disabled:opacity-50"
          title={current?.name}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner /> Cargando...
            </span>
          ) : (
            current?.name ?? "Sesión principal"
          )}
        </button>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {open && (
        <div className="absolute left-2 top-full z-50 mt-1 w-48 rounded-md border bg-popover shadow-lg p-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => handleSelect(session.id)}
              className={`w-full text-left px-2 py-1.5 rounded hover:bg-ring/10 text-sm ${
                session.id === sessionId ? "font-semibold text-custom-nick" : ""
              }`}
            >
              {session.name}
            </button>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva sesión</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Nombre de la sesión"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setNewSessionName("");
              }}
            >
              Cancelar
            </Button>

            <Button
              className="gap-1.5"
              disabled={!newSessionName.trim() || createSessionMutation.isPending}
              onClick={() => createSessionMutation.mutate({ name: newSessionName.trim() })}
            >
              {createSessionMutation.isPending && <Spinner />}
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

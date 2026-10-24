'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, User, Users, Swords, Settings, Play, ShieldUser, LogOut } from 'lucide-react';
import SeasonSelector from './season-selector';
import SessionSelector from './session-selector';
import { useAuthStore } from '@/lib/store/auth-store';

function DominoTileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="1" width="16" height="24" rx="2" />
      <line x1="4" y1="13" x2="20" y2="13" />
      {/* Cuadrante superior: 3 puntos en diagonal */}
      <circle cx="8" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9" r="1" fill="currentColor" stroke="none" />
      {/* Cuadrante inferior: 2 puntos en diagonal (sin el del centro) */}
      <circle cx="8" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="21" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const username = useAuthStore((s) => s.username);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const canManage = role === "session_admin" || role === "super_admin";
  const isSuperAdmin = role === "super_admin";

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-2 py-1 rounded transition ${
      pathname === path
        ? "text-custom-nick font-semibold bg-ring/20"
        : "text-custom-nick hover:bg-ring/10"
    }`;

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2 border-b border-t py-2">
        <SessionSelector />
        <SeasonSelector />
      </div>
      <nav className="py-4">
        <ul className="flex flex-col gap-1">
           <li>
            <Link href="/" className={linkClass("/")}>
              <Home className="size-4" />
              Inicio
            </Link>
          </li>

          <li>
            <Link href="/players" className={linkClass("/players")}>
              <User className="size-4" />
              Jugadores
            </Link>
          </li>

          <li>
            <Link href="/teams" className={linkClass("/teams")}>
              <Users className="size-4" />
              Parejas
            </Link>
          </li>

          <li>
            <Link href="/match" className={linkClass("/match")}>
              <DominoTileIcon className="size-4" />
              Partidos
            </Link>
          </li>

          <li>
            <Link href="/wars" className={linkClass("/wars")}>
              <Swords className="size-4" />
              Guerras
            </Link>
          </li>

          {canManage && (
            <>
              <li className="border-t mt-3 pt-3">
                <Link href="/manage" className={linkClass("/manage")}>
                  <Settings className="size-4" />
                  Gestión
                </Link>
              </li>

              <li>
                <Link href="/play" className={linkClass("/play")}>
                  <Play className="size-4" />
                  Jugar
                </Link>
              </li>
            </>
          )}

          {isSuperAdmin && (
            <li className="border-t mt-3 pt-3">
              <Link href="/users" className={linkClass("/users")}>
                <ShieldUser className="size-4" />
                Usuarios
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-auto flex items-center justify-between gap-2 border-t px-2 py-2">
        <span className="truncate text-xs text-muted-foreground" title={username ?? undefined}>
          {username}
        </span>

        <button
          type="button"
          onClick={handleLogout}
          title="Cerrar sesión"
          className="rounded-full p-1 text-muted-foreground hover:bg-ring/10 hover:text-foreground"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  )
}
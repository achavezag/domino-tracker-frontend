'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SeasonSelector from './season-selector';

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-2 py-1 rounded transition ${
      pathname === path
        ? "text-custom-nick font-semibold bg-ring/20"
        : "text-custom-nick hover:bg-ring/10"
    }`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b border-t py-2">
        <SeasonSelector />
      </div>
      <nav className="py-4">
        <ul className="flex flex-col gap-1">
           <li>
            <Link href="/" className={linkClass("/")}>
              Inicio
            </Link>
          </li>          

          <li>
            <Link href="/players" className={linkClass("/players")}>
              Jugadores
            </Link>
          </li>

          <li>
            <Link href="/teams" className={linkClass("/teams")}>
              Parejas
            </Link>
          </li>

          <li>
            <Link href="/match" className={linkClass("/match")}>
              Partidos
            </Link>
          </li>

          <li>
            <Link href="/wars" className={linkClass("/wars")}>
              Guerras
            </Link>
          </li>

          <li className="border-t mt-3 pt-3">
            <Link href="/manage" className={linkClass("/manage")}>
              Gestión
            </Link>
          </li>

          <li>
            <Link href="/play" className={linkClass("/play")}>
              Jugar
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
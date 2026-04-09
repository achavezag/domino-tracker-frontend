import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="flex flex-col">
      <div className="flex h-12 items-center border-b border-t">
        <div className="h-full w-10 flex items-center">
          {/* <CarIcon className="text-blue-800" size={32} /> */}
        </div>
        <div className="h-full w-44 flex items-center justify-start pt-4">
          {/* <CarsStockLogo /> */}
        </div>
      </div>
      <nav className="py-4">
        <ul>
          <li className="pt-1"><Link href="/">Inicio</Link></li>
          <li className="pt-1"><Link href="/players">Jugadores</Link></li>
          <li className="border-t mt-3 pt-3">
            <Link href="/manage">Gestión</Link>
          </li>
          <li className="pt-1"><Link href="/movements">Jugar</Link></li>
        </ul>
      </nav>
    </div>
  )
}
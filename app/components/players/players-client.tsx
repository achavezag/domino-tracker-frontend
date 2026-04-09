'use client';

import { getPlayers } from '@/lib/api/api';
import { useQuery } from '@tanstack/react-query';

export default function PlayersClient() {
  const { data: players = [], isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  console.log(players);

  if (isLoading) {
    return <span>Cargando...</span>;
  }

  return (
    <div className='flex'>
      {/* <h1>Jugadores</h1>

      <ul>
        {players.map((p: any) => (
          <li key={p.id}>
            {p.name} ({p.nickname})
          </li>
        ))}
      </ul> */}
    </div>
  );
}
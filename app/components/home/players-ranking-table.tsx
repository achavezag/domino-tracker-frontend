'use client';

import { useQuery } from '@tanstack/react-query';
import { getPlayersStats } from '@/lib/api/api';
import { PlayerStats } from '@/lib/types/types';
import { formatAverage } from '@/lib/helpers';

export default function PlayersRankingTable() {
  const { data = [], isLoading } = useQuery<PlayerStats[]>({
    queryKey: ["players-stats"],
    queryFn: getPlayersStats,
  });

  if (isLoading) {
    return <span>Cargando...</span>;
  }

  const rows = [...data]
    .sort((a, b) => b.winRate - a.winRate);

  return (
    <div className="border rounded-xl overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-muted">
          <tr className="text-left">

            <th className="px-3 py-2">Jugador</th>

            <th className="px-3 py-2 text-center">AVG</th>

            <th className="px-3 py-2 text-center">PJ</th>
            <th className="px-3 py-2 text-center">PG</th>
            <th className="px-3 py-2 text-center">PP</th>

            <th className="px-3 py-2 text-center">GJ</th>
            <th className="px-3 py-2 text-center">GG</th>
            <th className="px-3 py-2 text-center">GE</th>
            <th className="px-3 py-2 text-center">GP</th>

            <th className="px-3 py-2 text-center">G_AVG</th>

            <th className="px-3 py-2 text-center">PGJ</th>
            <th className="px-3 py-2 text-center">PGG</th>
            <th className="px-3 py-2 text-center">PGP</th>

          </tr>
        </thead>

        <tbody>
          {rows.map((player) => {

            const warDraws =
              player.warsPlayed -
              player.warWins -
              player.warLosses;

            return (
              <tr
                key={player.playerId}
                className="border-t"
              >
                <td className="px-3 py-2 font-medium">
                  {player.nickname}
                </td>

                <td className="px-3 py-2 text-center">
                  {formatAverage(player.winRate)}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.matchesPlayed}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.wins}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.losses}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.warsPlayed}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.warWins}
                </td>

                <td className="px-3 py-2 text-center">
                  {warDraws}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.warLosses}
                </td>

                <td className="px-3 py-2 text-center">
                  {formatAverage(player.warWinRate)}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.fixedMatches}
                </td>

                <td className="px-3 py-2 text-center">
                  {player.fixedWins}
                </td>
                
                <td className="px-3 py-2 text-center">
                  {player.fixedLosses}
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>

    </div>
  );
}
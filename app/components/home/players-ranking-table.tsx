'use client';

import { useQuery } from '@tanstack/react-query';
import { getPlayersStats } from '@/lib/api/api';
import { PlayerStats } from '@/lib/types/types';
import { useSeasonStore } from '@/lib/store/season-store';
import { LoadingState } from '@/components/ui/spinner';
import RankingTable, { RankingRow } from './ranking-table';

function toRankingRow(player: PlayerStats): RankingRow {
  return {
    id: player.playerId,
    name: player.nickname,
    matchesPlayed: player.matchesPlayed,
    wins: player.wins,
    losses: player.losses,
    winRate: player.winRate,
    warsPlayed: player.warsPlayed,
    warWins: player.warWins,
    warDraws: player.warsPlayed - player.warWins - player.warLosses,
    warLosses: player.warLosses,
    warWinRate: player.warWinRate,
    fixedMatches: player.fixedMatches,
    fixedWins: player.fixedWins,
    fixedLosses: player.fixedLosses,
    fixedMatchesWinRate: player.fixedMatchesWinRate,
    rotatingMatches: player.rotatingMatches,
    rotatingWins: player.rotatingWins,
    rotatingLosses: player.rotatingLosses,
    rotatingMatchesWinRate: player.rotatingMatchesWinRate,
  };
}

export default function PlayersRankingTable() {
  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data = [], isLoading } = useQuery<PlayerStats[]>({
    queryKey: ["players-stats", selectedSeasonIds],
    queryFn: () => getPlayersStats(selectedSeasonIds),
  });

  if (isLoading) {
    return <LoadingState />;
  }

  const rows = data
    .filter((p) => p.matchesPlayed > 0)
    .map(toRankingRow);

  return <RankingTable rows={rows} nameLabel="Jugador" />;
}

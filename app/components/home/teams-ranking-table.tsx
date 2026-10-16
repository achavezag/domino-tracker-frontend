'use client';

import { useQuery } from '@tanstack/react-query';
import { getTeamsStats } from '@/lib/api/api';
import { TeamStats } from '@/lib/types/types';
import { useSeasonStore } from '@/lib/store/season-store';
import { LoadingState } from '@/components/ui/spinner';
import RankingTable, { RankingRow } from './ranking-table';

function toRankingRow(team: TeamStats): RankingRow {
  return {
    id: team.teamId,
    name: `${team.player1Nickname} / ${team.player2Nickname}`,
    matchesPlayed: team.matchesPlayed,
    wins: team.wins,
    losses: team.losses,
    winRate: team.winRate,
    warsPlayed: team.warsPlayed,
    warWins: team.warWins,
    warDraws: team.warsPlayed - team.warWins - team.warLosses,
    warLosses: team.warLosses,
    warWinRate: team.warWinRate,
    fixedMatches: team.fixedMatches,
    fixedWins: team.fixedWins,
    fixedLosses: team.fixedLosses,
    fixedMatchesWinRate: team.fixedMatchesWinRate,
    rotatingMatches: team.rotatingMatches,
    rotatingWins: team.rotatingWins,
    rotatingLosses: team.rotatingLosses,
    rotatingMatchesWinRate: team.rotatingMatchesWinRate,
  };
}

export default function TeamsRankingTable() {
  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data = [], isLoading } = useQuery<TeamStats[]>({
    queryKey: ["teams-stats", selectedSeasonIds],
    queryFn: () => getTeamsStats(selectedSeasonIds),
  });

  if (isLoading) {
    return <LoadingState />;
  }

  const rows = data
    .filter((t) => t.matchesPlayed > 0)
    .map(toRankingRow);

  return <RankingTable rows={rows} nameLabel="Pareja" />;
}

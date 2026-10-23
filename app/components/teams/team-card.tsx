import { Team, TeamStats } from '@/lib/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatAverage } from '@/lib/helpers';
import { useViewModeStore } from '@/lib/store/view-mode-store';

type Props = {
  team: Team;
  stats?: TeamStats;
  onClick?: () => void;
  selected: boolean;
};

export default function TeamCard({ team, stats, onClick, selected }: Props) {
  const viewMode = useViewModeStore((s) => s.viewMode);

  const played = (stats?.wins ?? 0) + (stats?.losses ?? 0);

  const avg = formatAverage(stats?.winRate);
  const warAvg = formatAverage(stats?.warWinRate);
  const fixedMatchesAvg = formatAverage(stats?.fixedMatchesWinRate);
  const rotatingMatchesAvg = formatAverage(stats?.rotatingMatchesWinRate);

  const deuceWars = () => {
    if (stats?.warsPlayed !== undefined && stats.warWins !== undefined && stats.warLosses !== undefined) {
      return stats.warsPlayed - stats.warWins - stats.warLosses
    }
    return 0;
  }

  return (
    <Card className={`w-72 cursor-pointer transition border border-ring py-3 ${
        selected ? "bg-custom-hover/50" : "hover:bg-custom-hover/25"
      }`} onClick={onClick}
    >
      <CardContent className="px-4 flex flex-col gap-4">

        {/* PLAYERS */}
        <div className="flex justify-between font-semibold border-b pb-2">
          <span>{team.player1.nickname}</span>
          <span>{team.player2.nickname}</span>
        </div>

        <div className="flex flex-col w-full">

          <div>
            <div className="flex w-full items-center justify-center font-medium text-shadow-md pb-2">Totales</div>
            <div className="flex w-full gap-4 text-sm justify-between px-4">
              <div className="text-center">
                <div className="text-xs font-semibold text-custom-played">J</div>
                <div className="font-semibold text-custom-played">{played}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-custom-win">G</div>
                <div className="font-semibold text-custom-win">{stats?.wins ?? 0}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-custom-rotating">E</div>
                <div className="font-semibold text-custom-rotating">-</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-custom-lose">P</div>
                <div className="font-semibold text-custom-lose">{stats?.losses ?? 0}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-custom-avg">AVG</div>
                <div className="font-semibold text-custom-avg">{avg}</div>
              </div>
            </div>
          </div>

          {viewMode !== "compact" && (
          <>
            <div className="pt-4">
              <div className="flex w-full items-center justify-center font-medium text-shadow-md pb-2">Guerras</div>
              <div className="flex w-full gap-4 text-sm justify-between px-4">
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-played">J</div>
                  <div className="font-semibold text-custom-played">{stats?.warsPlayed}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-win">G</div>
                  <div className="font-semibold text-custom-win">{stats?.warWins ?? 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-rotating">E</div>
                  <div className="font-semibold text-custom-rotating">{deuceWars()}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-lose">P</div>
                  <div className="font-semibold text-custom-lose">{stats?.warLosses ?? 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-avg">AVG</div>
                  <div className="font-semibold text-custom-avg">{warAvg}</div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex w-full items-center justify-center font-medium text-shadow-md pb-2">Partidos fijos</div>
              <div className="flex w-full gap-4 text-sm justify-between px-4">
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-played">J</div>
                  <div className="font-semibold text-custom-played">{stats?.fixedMatches}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-win">G</div>
                  <div className="font-semibold text-custom-win">{stats?.fixedWins}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-rotating">E</div>
                  <div className="font-semibold text-custom-rotating">-</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-lose">P</div>
                  <div className="font-semibold text-custom-lose">{stats?.fixedLosses}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-avg">AVG</div>
                  <div className="font-semibold text-custom-avg">{fixedMatchesAvg}</div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex w-full items-center justify-center font-medium text-shadow-md pb-2">Partidos E/S</div>
              <div className="flex w-full gap-4 text-sm justify-between px-4">
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-played">J</div>
                  <div className="font-semibold text-custom-played">{stats?.rotatingMatches}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-win">G</div>
                  <div className="font-semibold text-custom-win">{stats?.rotatingWins}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-rotating">E</div>
                  <div className="font-semibold text-custom-rotating">-</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-lose">P</div>
                  <div className="font-semibold text-custom-lose">{stats?.rotatingLosses}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-custom-avg">AVG</div>
                  <div className="font-semibold text-custom-avg">{rotatingMatchesAvg}</div>
                </div>
              </div>
            </div>
          </>)}

        </div>
      </CardContent>
    </Card>
  );
}
import { Team, TeamStats } from '@/lib/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { formatAverage } from '@/lib/helpers';

type Props = {
  team: Team;
  stats?: TeamStats;
  onClick?: () => void;
  selected: boolean;
};


export default function TeamCard({ team, stats, onClick, selected }: Props) {
  const avg = formatAverage(stats?.winRate);
  const played = (stats?.wins ?? 0) + (stats?.losses ?? 0);

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

        {/* STATS */}
        <div className="flex justify-between text-sm">

          <div className="text-center">
            <div className="text-xs font-semibold text-custom-played">PJ</div>
            <div className="font-semibold text-custom-played">{played}</div>
          </div>

          <div className="text-center">
            <div className="text-xs font-semibold text-custom-win">G</div>
            <div className="font-semibold text-custom-win">{stats?.wins ?? 0}</div>
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
      </CardContent>
    </Card>
  );
}
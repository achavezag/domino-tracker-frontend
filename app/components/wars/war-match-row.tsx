import { MatchListItem } from '@/lib/types/types';

type Props = {
  match: MatchListItem;
  teamAName: string;
  teamBName: string;
  winsA: number;
  winsB: number;
};

export default function WarMatchRow({
  match,
  teamAName,
  teamBName,
  winsA,
  winsB,
}: Props) {
  const isTeamAOriginal = match.teamAName === teamAName;

  const scoreA = isTeamAOriginal ? match.teamAScore : match.teamBScore;
  const scoreB = isTeamAOriginal ? match.teamBScore : match.teamAScore;

  const isWinA = scoreA > scoreB;

  return (
    <div className="flex justify-between gap-2 items-center text-sm border-b border-custom-border/50 pb-1">

      {/* TEAM A */}
      <div className="w-2/5 flex justify-between items-center gap-2">
        <span className="truncate font-medium">{teamAName}</span>

        <div className="w-4 h-4 flex items-center justify-center rounded-full border border-custom-avg text-custom-avg text-xs font-semibold">
          {winsA}
        </div>
      </div>

      {/* SCORE */}
      <div className="w-1/5 text-center font-semibold">
        <span className={isWinA ? "text-custom-win" : "text-custom-lose"}>
          {scoreA}
        </span>
        <span className="px-2">-</span>
        <span className={!isWinA ? "text-custom-win" : "text-custom-lose"}>
          {scoreB}
        </span>
      </div>

      {/* TEAM B */}
      <div className="w-2/5 flex justify-between items-center gap-2">
        <div className="w-4 h-4 flex items-center justify-center rounded-full border border-custom-avg text-custom-avg text-xs font-semibold">
          {winsB}
        </div>

        <span className="truncate text-right font-medium">{teamBName}</span>
      </div>

    </div>
  );
}
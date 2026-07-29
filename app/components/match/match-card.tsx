import { MatchListItem } from '@/lib/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/helpers';
import { CheckSquare, Square } from 'lucide-react';

export default function MatchCard({ 
  match, 
  selectionMode, 
  selected, 
  onToggle 
}: { 
  match: MatchListItem;
  selectionMode?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
}) {
  const router = useRouter();
  const isTeamAWin = match.teamAScore > match.teamBScore;

   return (
    <Card
      className={`
        py-2 border border-ring transition
        ${selected ? "ring-2 ring-primary" : ""}
        ${!selectionMode ? "hover:bg-custom-hover/25 cursor-pointer" : ""}
      `}
      onClick={() => {
        if (selectionMode) return;
        router.push(`/match/${match.id}`);
      }}
    >
      <CardContent className="flex flex-col gap-1 px-4 py-2">

        {/* DATE */}
        <div className="flex justify-between items-center">
          <div className="text-xs font-semibold text-custom-date">
            {formatDate(match.finishedAt)}
          </div>

          {selectionMode && match.type === "Fixed" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.(match.id);
              }}
              className="flex items-center justify-center"
            >
              {selected ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          )}

          <div className={match.type === 'Fixed' ? "text-xs font-medium text-custom-fixed" : "text-xs font-medium text-custom-rotating"}>
            {match.type}
          </div>
        </div>

        {/* MATCH LINE */}
        <div className="flex justify-between items-center text-sm">

          <span className="truncate w-1/3 font-medium text-custom-nick">
            {match.teamAName}
          </span>

          <span className="font-semibold text-center w-1/3">
            <span className={isTeamAWin ? "text-custom-win" : "text-custom-lose"}>
              {match.teamAScore}
            </span>

            <span className="mx-3">-</span>

            <span className={!isTeamAWin ? "text-custom-win" : "text-custom-lose"}>
              {match.teamBScore}
            </span>
          </span>

          <span className="truncate text-right w-1/3 font-medium text-custom-nick">
            {match.teamBName}
          </span>

        </div>
      </CardContent>
    </Card>
  );
}
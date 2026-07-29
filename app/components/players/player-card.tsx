import Image from 'next/image';
import { useState } from 'react';
import { Player, PlayerStats } from '@/lib/types/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatAverage, getPlayerAvatar } from '@/lib/helpers';

type Props = {
  player: Player;
  stats?: PlayerStats;
};

export default function PlayerCard({ player, stats }: Props) {
  const [imgError, setImgError] = useState<boolean>(false);
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
    <Card className="w-60 border border-ring">
      <CardContent className="px-2 flex flex-col gap-4 items-center">
        {/* Avatar */}
        <Avatar className="h-32 w-32 overflow-hidden">
          {!imgError && (
            <Image
              src={getPlayerAvatar(player.nickname)}
              alt={player.name}
              width={128}
              height={128}
              unoptimized
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          )}

          <AvatarFallback>
            {player.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex gap-2 text-shadow-md">
          <div className="font-semibold">{player.name}</div>
          <div className="text-sm text-custom-nick font-medium">
            {`(${player.nickname})`}
          </div>
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
            <div className="flex w-full items-center justify-center font-medium text-shadow-md pb-2">Partidos de guerras</div>
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

        </div>
      </CardContent>
    </Card>
  );
}
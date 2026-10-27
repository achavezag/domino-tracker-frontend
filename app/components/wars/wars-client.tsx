'use client';

import { useQuery } from '@tanstack/react-query';
import { getWars } from '@/lib/api/api';
import { WarListItem } from '@/lib/types/types';
import WarItem from './war-item';
import { useSeasonStore } from '@/lib/store/season-store';
import { LoadingState } from '@/components/ui/spinner';

export default function WarsClient() {
  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data: wars = [], isLoading } = useQuery<WarListItem[]>({
    queryKey: ["wars", selectedSeasonIds],
    queryFn: () => getWars(selectedSeasonIds),
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="flex flex-col gap-2">

      {/* HEADER */}
      <div className="flex items-center justify-center md:justify-start">
        <h1 className="text-lg md:text-xl font-semibold text-shadow-2xs">Guerras</h1>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wars.map((war) => (
          <WarItem key={war.id} war={war} />
        ))}
      </div>
    </div>
  );
}
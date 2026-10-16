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
    <div className="flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Guerras</h1>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4">
        {wars.map((war) => (
          <WarItem key={war.id} war={war} />
        ))}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { getWarById } from '@/lib/api/api';
import { WarListItem, WarDetail } from '@/lib/types/types';
import { formatDate } from '@/lib/helpers';
import WarMatchRow from './war-match-row';
import { LoadingState } from '@/components/ui/spinner';

export default function WarItem({ war }: { war: WarListItem }) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<WarDetail>({
    queryKey: ["war", war.id],
    queryFn: () => getWarById(war.id),
    enabled: open,
  });

  return (
    <div className="border rounded-t-sm border-ring">

      {/* HEADER */}
      <div
        className="px-2 md:px-3 py-2 cursor-pointer bg-muted flex justify-between items-center border-b border-ring rounded-t-md"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm text-custom-date">
          {formatDate(war.date)}
        </span>

        <div className="flex w-full gap-1.5 text-sm items-center justify-center pr-4 md:pr-10">
          <p className="font-semibold">
            {war.teamAName}
          </p>
          <span className="text-muted-foreground"> vs </span> 
          <p className="font-semibold">
            {war.teamBName}
          </p>
        </div>

        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* CONTENT */}
      {open && (
        <div className="py-2 px-1 md:p-3 flex flex-col gap-2">

          {isLoading ? (
            <LoadingState />
          ) : data?.matches.length === 0 ? (
            <span>No hay partidos</span>
          ) : (
            <div className="flex flex-col gap-2">

              {(() => {
                let winsA = 0;
                let winsB = 0;

                return data?.matches.map((m) => {
                  const isTeamAOriginal = m.teamAName === war.teamAName;

                  const scoreA = isTeamAOriginal ? m.teamAScore : m.teamBScore;
                  const scoreB = isTeamAOriginal ? m.teamBScore : m.teamAScore;

                  if (scoreA > scoreB) {
                    winsA++;
                  } else {
                    winsB++;
                  }

                  return (
                    <WarMatchRow
                      key={m.id}
                      match={m}
                      teamAName={war.teamAName}
                      teamBName={war.teamBName}
                      winsA={winsA}
                      winsB={winsB}
                    />
                  );
                });
              })()}

            </div>
          )}

        </div>
)}
    </div>
  );
}
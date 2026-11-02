'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MatchListItem } from '@/lib/types/types';
import WarMatchRow from '../wars/war-match-row';

type Props = {
  teamAName: string;
  teamBName: string;
  type: string;
  matches: MatchListItem[];
};

export default function DayMatchupCard({ teamAName, teamBName, type, matches }: Props) {
  const [open, setOpen] = useState(false);

  let winsA = 0;
  let winsB = 0;

  return (
    <div className="border rounded-t-sm border-ring">

      {/* HEADER */}
      <div
        className="px-2 md:px-3 py-2 cursor-pointer bg-muted flex justify-between items-center border-b border-ring rounded-t-md"
        onClick={() => setOpen(!open)}
      >
        <span className={`font-medium text-sm shrink-0 ${type === "Fixed" ? "text-custom-fixed" : "text-custom-rotating"}`}>
          {type === "Fixed" ? "Fijo" : "Rotativo"}
        </span>

        <div className="flex w-full gap-1.5 text-sm items-center justify-center pr-4 md:pr-10">
          <p className="font-semibold">{teamAName}</p>
          <span className="text-muted-foreground"> vs </span>
          <p className="font-semibold">{teamBName}</p>
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
          {matches.map((m) => {
            const isTeamAOriginal = m.teamAName === teamAName;
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
                teamAName={teamAName}
                teamBName={teamBName}
                winsA={winsA}
                winsB={winsB}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

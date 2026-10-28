'use client';

import { useState } from 'react';
import PlayersRankingTable from './players-ranking-table';
import TeamsRankingTable from './teams-ranking-table';
import ViewModeSwitch from '../view-mode-switch';

export default function HomeClient() {
  const [tab, setTab] = useState<"players" | "teams">("players");

  return (
    <div className="w-full max-w-11/12 p-1 md:p-3">

      {/* TABS */}
      <div className="sticky top-0 z-10 -mt-3 bg-white pt-3 flex items-center gap-3 mb-4 justify-between border-b border-ring pb-2 md:static md:mt-0 md:pt-0">

        <div className="flex gap-2">
          <button
            className={`w24 md:w-32 px-4 py-2 rounded-lg border ${
              tab === "players"
                ? "bg-custom-hover text-foreground font-semibold text-sm"
                : "text-muted-foreground text-sm"
            }`}
            onClick={() => setTab("players")}
          >
            Jugadores
          </button>

          <button
            className={`w-24 md:w-32 px-4 py-2 rounded-lg border ${
              tab === "teams"
                ? "bg-custom-hover text-foreground font-semibold text-sm"
                : "text-muted-foreground text-sm"
            }`}
            onClick={() => setTab("teams")}
          >
            Parejas
          </button>
        </div>

        <ViewModeSwitch />

      </div>

      {tab === "players" && (
        <PlayersRankingTable />
      )}

      {tab === "teams" && (
        <TeamsRankingTable />
      )}

    </div>
  );
}
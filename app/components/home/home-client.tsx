'use client';

import { useState } from 'react';
import PlayersRankingTable from './players-ranking-table';
import TeamsRankingTable from './teams-ranking-table';
import ViewModeSwitch from '../view-mode-switch';

export default function HomeClient() {
  const [tab, setTab] = useState<"players" | "teams">("players");

  return (
    <div className="w-full max-w-11/12 md:max-w-full py-2 md:p-3">

      {/* TABS */}
      <div className="sticky top-0 z-10 -mt-3 bg-background pt-3 flex items-center gap-3 mb-4 justify-between border-b border-ring pb-2 md:static md:mt-0 md:pt-0">

        <div className="flex gap-2">
          <button
            className={`w24 md:w-32 px-4 py-2 rounded-lg border text-sm transition ${
              tab === "players"
                ? "bg-muted text-foreground border-border font-semibold"
                : "bg-background text-muted-foreground border-border hover:bg-foreground/10 hover:text-foreground"
            }`}
            onClick={() => setTab("players")}
          >
            Jugadores
          </button>

          <button
            className={`w-24 md:w-32 px-4 py-2 rounded-lg border text-sm transition ${
              tab === "teams"
                ? "bg-muted text-foreground border-border font-semibold"
                : "bg-background text-muted-foreground border-border hover:bg-foreground/10 hover:text-foreground"
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
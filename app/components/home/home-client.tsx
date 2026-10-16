'use client';

import { useState } from 'react';
import PlayersRankingTable from './players-ranking-table';
import TeamsRankingTable from './teams-ranking-table';

export default function HomeClient() {
  const [tab, setTab] = useState<"players" | "teams">("players");

  return (
    <div className="w-full max-w-11/12 p-6">

      {/* TABS */}
      <div className="flex gap-2 mb-6">

        <button
          className={`w-32 px-4 py-2 rounded-lg border ${
            tab === "players"
              ? "bg-custom-hover text-foreground font-semibold text-sm"
              : "text-muted-foreground text-sm"
          }`}
          onClick={() => setTab("players")}
        >
          Jugadores
        </button>

        <button
          className={`w-32 px-4 py-2 rounded-lg border ${
            tab === "teams"
              ? "bg-custom-hover text-foreground font-semibold text-sm"
              : "text-muted-foreground text-sm"
          }`}
          onClick={() => setTab("teams")}
        >
          Parejas
        </button>

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
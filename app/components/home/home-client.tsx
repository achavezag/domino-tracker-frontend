'use client';

import { useState } from 'react';
import PlayersRankingTable from './players-ranking-table';

export default function HomeClient() {
  const [tab, setTab] = useState<"players" | "teams">("players");

  return (
    <div className="w-full max-w-7xl p-6">

      {/* TABS */}
      <div className="flex gap-2 mb-6">

        <button
          className={`px-4 py-2 rounded-lg border ${
            tab === "players"
              ? "bg-primary text-primary-foreground"
              : ""
          }`}
          onClick={() => setTab("players")}
        >
          Jugadores
        </button>

        <button
          className={`px-4 py-2 rounded-lg border ${
            tab === "teams"
              ? "bg-primary text-primary-foreground"
              : ""
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
        <div className="border rounded-xl p-6 text-muted-foreground">
          Próximamente
        </div>
      )}

    </div>
  );
}
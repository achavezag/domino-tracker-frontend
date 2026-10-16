'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { formatAverage } from '@/lib/helpers';

export type RankingRow = {
  id: string;
  name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  warsPlayed: number;
  warWins: number;
  warDraws: number;
  warLosses: number;
  warWinRate: number;
  fixedMatches: number;
  fixedWins: number;
  fixedLosses: number;
  fixedMatchesWinRate: number;
  rotatingMatches: number;
  rotatingWins: number;
  rotatingLosses: number;
  rotatingMatchesWinRate: number;
};

type ColumnKind = "name" | "played" | "won" | "drawn" | "lost" | "avg";
type SortDir = "asc" | "desc";

type Column = {
  key: string;
  label: string;
  kind: ColumnKind;
  group?: string;
  value: (row: RankingRow) => number | string;
  display: (row: RankingRow) => string;
};

const kindClass: Record<ColumnKind, string> = {
  name: "font-medium",
  played: "text-custom-played font-medium",
  won: "text-custom-win font-medium",
  drawn: "text-custom-rotating font-medium",
  lost: "text-custom-lose font-medium",
  avg: "text-custom-avg font-semibold",
};

function buildColumns(nameLabel: string): Column[] {
  return [
    { key: "name", label: nameLabel, kind: "name", value: (r) => r.name, display: (r) => r.name },

    { key: "matchesPlayed", label: "PJ", kind: "played", group: "General", value: (r) => r.matchesPlayed, display: (r) => `${r.matchesPlayed}` },
    { key: "wins", label: "PG", kind: "won", group: "General", value: (r) => r.wins, display: (r) => `${r.wins}` },
    { key: "losses", label: "PP", kind: "lost", group: "General", value: (r) => r.losses, display: (r) => `${r.losses}` },
    { key: "winRate", label: "AVG", kind: "avg", group: "General", value: (r) => r.winRate, display: (r) => formatAverage(r.winRate) },

    { key: "warsPlayed", label: "GJ", kind: "played", group: "Guerras", value: (r) => r.warsPlayed, display: (r) => `${r.warsPlayed}` },
    { key: "warWins", label: "GG", kind: "won", group: "Guerras", value: (r) => r.warWins, display: (r) => `${r.warWins}` },
    { key: "warDraws", label: "GE", kind: "drawn", group: "Guerras", value: (r) => r.warDraws, display: (r) => `${r.warDraws}` },
    { key: "warLosses", label: "GP", kind: "lost", group: "Guerras", value: (r) => r.warLosses, display: (r) => `${r.warLosses}` },
    { key: "warWinRate", label: "G_AVG", kind: "avg", group: "Guerras", value: (r) => r.warWinRate, display: (r) => formatAverage(r.warWinRate) },

    { key: "fixedMatches", label: "PGJ", kind: "played", group: "Partidos de guerras", value: (r) => r.fixedMatches, display: (r) => `${r.fixedMatches}` },
    { key: "fixedWins", label: "PGG", kind: "won", group: "Partidos de guerras", value: (r) => r.fixedWins, display: (r) => `${r.fixedWins}` },
    { key: "fixedLosses", label: "PGP", kind: "lost", group: "Partidos de guerras", value: (r) => r.fixedLosses, display: (r) => `${r.fixedLosses}` },
    { key: "fixedMatchesWinRate", label: "PG_AVG", kind: "avg", group: "Partidos de guerras", value: (r) => r.fixedMatchesWinRate, display: (r) => formatAverage(r.fixedMatchesWinRate) },

    { key: "rotatingMatches", label: "PRJ", kind: "played", group: "Partidos rotativos", value: (r) => r.rotatingMatches, display: (r) => `${r.rotatingMatches}` },
    { key: "rotatingWins", label: "PRG", kind: "won", group: "Partidos rotativos", value: (r) => r.rotatingWins, display: (r) => `${r.rotatingWins}` },
    { key: "rotatingLosses", label: "PRP", kind: "lost", group: "Partidos rotativos", value: (r) => r.rotatingLosses, display: (r) => `${r.rotatingLosses}` },
    { key: "rotatingMatchesWinRate", label: "PR_AVG", kind: "avg", group: "Partidos rotativos", value: (r) => r.rotatingMatchesWinRate, display: (r) => formatAverage(r.rotatingMatchesWinRate) },
  ];
}

function groupSpans(columns: Column[]) {
  const spans: { label: string; span: number }[] = [];

  for (const col of columns) {
    if (!col.group) continue;

    const last = spans[spans.length - 1];
    if (last && last.label === col.group) {
      last.span += 1;
    } else {
      spans.push({ label: col.group, span: 1 });
    }
  }

  return spans;
}

export default function RankingTable({
  rows,
  nameLabel = "Nombre",
}: {
  rows: RankingRow[];
  nameLabel?: string;
}) {
  const columns = useMemo(() => buildColumns(nameLabel), [nameLabel]);
  const groups = useMemo(() => groupSpans(columns), [columns]);

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir | null>(null);

  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const sortedRows = useMemo(() => {
    if (!sortKey || !sortDir) {
      return [...rows].sort((a, b) => b.winRate - a.winRate);
    }

    const column = columns.find((c) => c.key === sortKey);
    if (!column) return rows;

    return [...rows].sort((a, b) => {
      const va = column.value(a);
      const vb = column.value(b);

      const cmp =
        typeof va === "string" || typeof vb === "string"
          ? String(va).localeCompare(String(vb))
          : (va as number) - (vb as number);

      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, columns, sortKey, sortDir]);

  return (
    <div className="border rounded-xl overflow-hidden">

      <table className="w-full text-sm">

        <thead className="bg-muted">
          {/* SECTIONS */}
          <tr className="text-left">
            <th className="px-3 py-1.5" />

            {groups.map((g, i) => (
              <th
                key={`${g.label}-${i}`}
                colSpan={g.span}
                className="px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground border-l border-border"
              >
                {g.label}
              </th>
            ))}
          </tr>

          {/* COLUMNS */}
          <tr className="text-left border-t border-border">
            {columns.map((col, i) => {
              const isActive = sortKey === col.key;
              const isGroupStart = col.group !== undefined && i > 0 && columns[i - 1].group !== col.group;

              return (
                <th
                  key={col.key}
                  className={`px-3 py-2 text-center select-none ${col.key === "name" ? "text-left" : ""} ${isGroupStart ? "border-l border-border" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={`inline-flex items-center gap-1 hover:text-foreground ${isActive ? "text-foreground font-semibold" : "text-inherit"}`}
                  >
                    {col.label}
                    {isActive ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )
                    ) : (
                      <ChevronsUpDown className="size-3.5 opacity-40" />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.id} className="border-t">
              {columns.map((col, i) => {
                const isGroupStart = col.group !== undefined && i > 0 && columns[i - 1].group !== col.group;

                return (
                  <td
                    key={col.key}
                    className={`px-3 py-2 text-center ${col.key === "name" ? "text-left" : ""} ${kindClass[col.kind]} ${isGroupStart ? "border-l border-border" : ""}`}
                  >
                    {col.display(row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

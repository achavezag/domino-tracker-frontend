'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { formatAverage } from '@/lib/helpers';
import { useViewModeStore } from '@/lib/store/view-mode-store';
import { cn } from '@/lib/utils';

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

    { key: "fixedMatches", label: "PFJ", kind: "played", group: "Partidos fijos", value: (r) => r.fixedMatches, display: (r) => `${r.fixedMatches}` },
    { key: "fixedWins", label: "PFG", kind: "won", group: "Partidos fijos", value: (r) => r.fixedWins, display: (r) => `${r.fixedWins}` },
    { key: "fixedLosses", label: "PFP", kind: "lost", group: "Partidos fijos", value: (r) => r.fixedLosses, display: (r) => `${r.fixedLosses}` },
    { key: "fixedMatchesWinRate", label: "PF_AVG", kind: "avg", group: "Partidos fijos", value: (r) => r.fixedMatchesWinRate, display: (r) => formatAverage(r.fixedMatchesWinRate) },

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
  const viewMode = useViewModeStore((s) => s.viewMode);
  const isCompact = viewMode === "compact";

  const allColumns = useMemo(() => buildColumns(nameLabel), [nameLabel]);

  const columns = useMemo(
    () =>
      isCompact
        ? allColumns.filter((c) => !c.group || c.group === "General")
        : allColumns,
    [allColumns, isCompact]
  );

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

  const nameColumn = columns.find((c) => c.key === "name")!;

  const groupedColumnSets = useMemo(() => {
    const groupLabels = [...new Set(groups.map((g) => g.label))];
    return groupLabels.map((label) => ({
      label,
      columns: [nameColumn, ...columns.filter((c) => c.group === label)],
    }));
  }, [groups, columns, nameColumn]);

  const sortButton = (col: Column) => {
    const isActive = sortKey === col.key;

    return (
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
    );
  };

  const renderSimpleTable = (cols: Column[], title?: string) => (
    <div className="border rounded-xl overflow-hidden">
      {title && (
        <div className="bg-muted px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
          {title}
        </div>
      )}

      <table className={cn("w-full", isCompact ? "text-sm" : "text-xs md:text-sm")}>
        <thead className="bg-muted">
          <tr className="text-left border-b border-border">
            {cols.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "py-2 text-center select-none",
                  isCompact ? "px-2 md:px-6" : "px-1 md:px-3",
                  col.key === "name" && "text-left max-w-20 md:max-w-none"
                )}
              >
                {sortButton(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.id} className="border-t">
              {cols.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "py-2 text-center",
                    isCompact ? "px-2 md:px-6" : "px-1 md:px-3",
                    col.key === "name" && "text-left max-w-20 truncate md:max-w-none",
                    kindClass[col.kind]
                  )}
                >
                  {col.display(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isCompact) {
    return <div className="max-w-2xl mx-auto">{renderSimpleTable(columns)}</div>;
  }

  return (
    <>
      {/* Desktop: single wide table with grouped column headers */}
      <div className="hidden md:block border rounded-xl overflow-hidden">
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
                const isGroupStart = col.group !== undefined && i > 0 && columns[i - 1].group !== col.group;

                return (
                  <th
                    key={col.key}
                    className={cn(
                      "py-2 text-center select-none px-3",
                      col.key === "name" && "text-left",
                      isGroupStart && "border-l border-border"
                    )}
                  >
                    {sortButton(col)}
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
                      className={cn(
                        "py-2 text-center px-3",
                        col.key === "name" && "text-left",
                        kindClass[col.kind],
                        isGroupStart && "border-l border-border"
                      )}
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

      {/* Mobile: one narrow table per group, stacked, to avoid horizontal scroll */}
      <div className="flex flex-col gap-4 md:hidden">
        {groupedColumnSets.map((g) => (
          <div key={g.label}>{renderSimpleTable(g.columns, g.label)}</div>
        ))}
      </div>
    </>
  );
}

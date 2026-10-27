'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { MatchFilters, MatchType, Team } from '@/lib/types/types';

type Props = {
  filters: MatchFilters;
  setFilters: React.Dispatch<React.SetStateAction<MatchFilters>>;
  teams: Team[];
};

export default function MatchesFilters({
  filters,
  setFilters,
  teams,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-3 px-2 md:px-3 py-2 border border-ring rounded-xl">

      <div className="flex w-full items-center justify-between md:justify-start gap-2">
        {/* DATE FROM */}
        <Input
          type="date"
          className="w-36 md:w-fit text-sm"
          value={filters.fromDate ?? ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              fromDate: e.target.value || undefined,
            })
          }
        />

        {/* DATE TO */}
        <Input
          type="date"
          className="w-36 md:w-fit text-sm"
          value={filters.toDate ?? ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              toDate: e.target.value || undefined,
            })
          }
        />
      </div>      

      <div className="flex w-full items-center justify-between md:justify-start md:gap-3">
        {/* TEAM A */}
        <Select
          value={filters.teamAId ?? "all"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              teamAId: value === "all"
                ? undefined
                : value,
            })
          }
        >
          <SelectTrigger className="w-36 md:w-64">
            <SelectValue placeholder="Pareja A" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              Parejas (todas)
            </SelectItem>

            {teams.map((t) => (
              <SelectItem
                key={t.id}
                value={t.id}
              >
                {t.player1.nickname} / {t.player2.nickname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground text-sm">
          vs
        </span>

        {/* TEAM B */}
        <Select
          value={filters.teamBId ?? "all"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              teamBId: value === "all"
                ? undefined
                : value,
            })
          }
        >
          <SelectTrigger className="w-36 md:w-64">
            <SelectValue placeholder="Pareja B" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              Parejas (todas)
            </SelectItem>

            {teams.map((t) => (
              <SelectItem
                key={t.id}
                value={t.id}
              >
                {t.player1.nickname} / {t.player2.nickname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full items-center justify-between md:justify-start gap-2">
        {/* TYPE */}
        <Select
          value={filters.type ?? "all"}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              type: value === "all"
                ? undefined
                : (value as MatchType),
            })
          }
        >
          <SelectTrigger className="w-36 md:w-48">
            <SelectValue placeholder="Tipo de partido" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              Partidos (todos)
            </SelectItem>

            <SelectItem value="Fixed">
              Fijo
            </SelectItem>

            <SelectItem value="Rotating">
              Rotativo
            </SelectItem>
          </SelectContent>
        </Select>

        {/* CLEAR */}
        <Button
          variant="outline"
          className="w-32 ml-auto"
          onClick={() => setFilters({})}
        >
          Limpiar
        </Button>
      </div>

    </div>
  );
}
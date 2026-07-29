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
    <div className="flex w-full items-center gap-3 px-3 py-2 border border-ring rounded-xl">

      {/* DATE FROM */}
      <Input
        type="date"
        className="w-fit"
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
        className="w-fit"
        value={filters.toDate ?? ""}
        onChange={(e) =>
          setFilters({
            ...filters,
            toDate: e.target.value || undefined,
          })
        }
      />

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
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Tipo de partido" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Todos los partidos
          </SelectItem>

          <SelectItem value="Fixed">
            Fijo
          </SelectItem>

          <SelectItem value="Rotating">
            Rotativo
          </SelectItem>
        </SelectContent>
      </Select>

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
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Pareja A" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Todas las parejas
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
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Pareja B" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            Todas las parejas
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

      {/* CLEAR */}
      <Button
        variant="outline"
        className="w-32 ml-auto"
        onClick={() => setFilters({})}
      >
        Limpiar
      </Button>

    </div>
  );
}
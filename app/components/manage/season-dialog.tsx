'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSeason, updateSeason } from '@/lib/api/api';
import { MatchListItem, Season } from '@/lib/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { addDaysToDate, toDateOnly } from '@/lib/helpers';

const FAR_FUTURE = "9999-12-31";

function rangesOverlap(
  aStart: string,
  aEnd: string | null,
  bStart: string,
  bEnd: string | null
) {
  const aEndValue = aEnd ?? FAR_FUTURE;
  const bEndValue = bEnd ?? FAR_FUTURE;

  return aStart <= bEndValue && bStart <= aEndValue;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  season?: Season;
  seasons: Season[];
  seasonMatches?: MatchListItem[];
};

export default function SeasonDialog({
  open,
  onOpenChange,
  mode,
  season,
  seasons,
  seasonMatches = [],
}: Props) {
  const queryClient = useQueryClient();

  const sortedSeasons = useMemo(
    () =>
      [...seasons].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    [seasons]
  );

  const lastSeason = sortedSeasons[sortedSeasons.length - 1];

  const nextAlias =
    mode === "create"
      ? seasons.length > 0
        ? Math.max(...seasons.map((s) => s.alias)) + 1
        : 1
      : season?.alias ?? 0;

  const defaultStartDate =
    mode === "create"
      ? lastSeason?.endDate
        ? addDaysToDate(toDateOnly(lastSeason.endDate), 1)
        : ""
      : toDateOnly(season!.startDate);

  const defaultEndDate =
    mode === "edit" && season?.endDate ? toDateOnly(season.endDate) : "";

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);

  useEffect(() => {
    if (!open) return;
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const hasMatches = seasonMatches.length > 0;

  const otherSeasons = seasons.filter((s) =>
    mode === "edit" ? s.id !== season?.id : true
  );

  const overlapsExisting = otherSeasons.some((s) =>
    rangesOverlap(
      startDate,
      endDate || null,
      toDateOnly(s.startDate),
      s.endDate ? toDateOnly(s.endDate) : null
    )
  );

  const invalidRange = !!endDate && endDate <= startDate;

  const shrinkingPastMatches = useMemo(() => {
    if (mode !== "edit" || !season?.endDate) return false;

    const oldEnd = toDateOnly(season.endDate);
    if (!endDate || endDate >= oldEnd) return false;

    return seasonMatches.some((m) => {
      if (!m.finishedAt) return false;
      const finished = toDateOnly(m.finishedAt);
      return finished > endDate && finished <= oldEnd;
    });
  }, [mode, season, endDate, seasonMatches]);

  const createMutation = useMutation({
    mutationFn: createSeason,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      toast.success("Temporada creada");
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error creando temporada");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { startDate: string; endDate: string | null }) =>
      updateSeason(season!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
      queryClient.invalidateQueries({ queryKey: ["season-matches"] });
      toast.success("Temporada actualizada");
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error actualizando temporada");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const canSubmit =
    !!startDate && !invalidRange && !overlapsExisting && !shrinkingPastMatches;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const payload = { startDate, endDate: endDate || null };

    if (mode === "create") {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Agregar temporada" : "Editar temporada"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {mode === "create" ? "crear" : "editar"} una temporada
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Temporada</span>
            <span className="font-semibold">{nextAlias}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Fecha de inicio</span>
            <Input
              className="h-8 w-40"
              type="date"
              value={startDate}
              disabled={mode === "edit" && hasMatches}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Fecha de fin</span>
            <Input
              className="h-8 w-40"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {overlapsExisting && (
            <p className="text-sm text-custom-lose">
              El rango se solapa con otra temporada existente.
            </p>
          )}

          {!overlapsExisting && invalidRange && (
            <p className="text-sm text-custom-lose">
              La fecha de fin debe ser posterior a la fecha de inicio.
            </p>
          )}

          {!overlapsExisting && !invalidRange && shrinkingPastMatches && (
            <p className="text-sm text-custom-lose">
              Hay partidos después de esa fecha de fin; no pueden quedar sin temporada.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            className="gap-1.5"
            disabled={!canSubmit || isPending}
            onClick={handleSubmit}
          >
            {isPending && <Spinner />}
            {mode === "create" ? "Agregar" : "Aceptar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

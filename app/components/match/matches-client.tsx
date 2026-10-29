'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { createWar, getMatches, getTeams } from '@/lib/api/api';
import MatchCard from './match-card';
import { useState } from 'react';
import { MatchFilters } from '@/lib/types/types';
import MatchesFilters from './matches-filters';
import { toast } from 'sonner';
import { CheckSquare, Plus, Save, Square } from 'lucide-react';
import { useSeasonStore } from '@/lib/store/season-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { LoadingState, Spinner } from '@/components/ui/spinner';

export default function MatchesClient() {
  const [filters, setFilters] = useState<MatchFilters>({});
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);

  const role = useAuthStore((s) => s.role);
  const canManage = role === "session_admin" || role === "super_admin";

  const selectedSeasonIds = useSeasonStore((s) => s.selectedSeasonIds);

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches", filters, selectedSeasonIds],
    queryFn: () => getMatches({ ...filters, seasonIds: selectedSeasonIds }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const toggleMatch = (id: string) => {
    setSelectedMatches((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
  if (allSelected) {
    setSelectedMatches([]);
  } else {
    setSelectedMatches(fixedMatches.map((m) => m.id));
  }
};

  const clearSelection = () => {
    setSelectedMatches([]);
  };

  const fixedMatches = matches.filter((m) => m.type === "Fixed");

  const allSelected =
    fixedMatches.length > 0 &&
    fixedMatches.every((m) => selectedMatches.includes(m.id));

  const someSelected =
    fixedMatches.some((m) => selectedMatches.includes(m.id));

  const createWarMutation = useMutation({
    mutationFn: createWar,
    onSuccess: () => {
      toast.success("Guerra creada correctamente");
      setSelectionMode(false);
      setSelectedMatches([]);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Error";

      if (message.includes("misma guerra")) {
        toast.error("Los partidos no pertenecen a la misma guerra");
      } else {
        toast.error(message);
      }
      if (message.includes("Ya existe una guerra")) {
        toast.warning("Esta guerra ya fue guardada");
      }
    },
  });

  const visibleMatches = selectionMode ? fixedMatches : matches;

  if (isLoading) return <LoadingState />;

  return (
    <>
      <div className="flex flex-col pb-2">
        <div className="flex flex-col gap-4">

          <MatchesFilters
            filters={filters}
            setFilters={setFilters}
            teams={teams}
          />
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-0.5">
            {visibleMatches.map((m) => (
              <MatchCard 
                key={m.id} 
                match={m}
                selectionMode={selectionMode}
                selected={selectedMatches.includes(m.id)}
                onToggle={toggleMatch} 
              />
            ))}
          </div>
          
        </div>      
      </div>

      {canManage && (
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end">
        {/* SELECT ALL */}
        {selectionMode && (
          <button
            onClick={toggleSelectAll}
            className="h-10 w-10 rounded-full bg-background/90 border shadow-lg flex items-center justify-center hover:scale-105 transition"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4" />
            ) : someSelected ? (
              <Square className="w-4 h-4 opacity-40" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        )}

        {/* SAVE */}
        {selectionMode && (
          <button
            onClick={() => createWarMutation.mutate(selectedMatches)}
            disabled={selectedMatches.length === 0 || createWarMutation.isPending}
            className="h-12 w-12 rounded-full bg-custom-fixed/80 text-background shadow-xl border border-ring flex items-center justify-center hover:scale-105 transition disabled:opacity-75"
          >
            {createWarMutation.isPending ? (
              <Spinner className="size-6" />
            ) : (
              <Save className="w-6 h-6" />
            )}
          </button>
        )}

        {/* TOGGLE MODE */}
        <button
          onClick={() => {
            if (!selectionMode) {
              setSelectionMode(true);
              setFilters((prev) => ({ ...prev, type: "Fixed" }));
            } else {
              setSelectionMode(false);
              clearSelection();
            }
          }}
          className="h-12 w-12 rounded-full bg-custom-fixed text-background border border-ring shadow-xl flex items-center justify-center hover:scale-105 transition"
        >
          <Plus
            className={`w-6 h-6 transition-transform ${
              selectionMode ? "rotate-45" : ""
            }`}
          />
        </button>
      </div>
      )}
    </>
  );
}
'use client';

import { Minimize2, Maximize2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useViewModeStore } from '@/lib/store/view-mode-store';

export default function ViewModeSwitch() {
  const viewMode = useViewModeStore((s) => s.viewMode);
  const setViewMode = useViewModeStore((s) => s.setViewMode);

  const isFull = viewMode === "full";

  return (
    <div className="flex items-center gap-2 text-sm">
      <Label htmlFor="view-mode-switch" className="hidden md:inline">Vista compacta</Label>

      <Tooltip>
        <TooltipTrigger className="md:hidden inline-flex">
          <Minimize2 className="size-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>Vista compacta</TooltipContent>
      </Tooltip>

      <Switch
        className="hover:cursor-pointer"
        id="view-mode-switch"
        checked={isFull}
        onCheckedChange={(checked) => setViewMode(checked ? "full" : "compact")}
      />

      <Label htmlFor="view-mode-switch" className="hidden md:inline">Vista completa</Label>

      <Tooltip>
        <TooltipTrigger className="md:hidden inline-flex">
          <Maximize2 className="size-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>Vista completa</TooltipContent>
      </Tooltip>
    </div>
  );
}

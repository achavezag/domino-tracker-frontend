'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useViewModeStore } from '@/lib/store/view-mode-store';

export default function ViewModeSwitch() {
  const viewMode = useViewModeStore((s) => s.viewMode);
  const setViewMode = useViewModeStore((s) => s.setViewMode);

  const isFull = viewMode === "full";

  return (
    <div className="flex items-center gap-2 text-sm">
      <Label htmlFor="view-mode-switch">Vista compacta</Label>

      <Switch
        className="hover:cursor-pointer"
        id="view-mode-switch"
        checked={isFull}
        onCheckedChange={(checked) => setViewMode(checked ? "full" : "compact")}
      />

      <Label htmlFor="view-mode-switch">Vista completa</Label>
    </div>
  );
}

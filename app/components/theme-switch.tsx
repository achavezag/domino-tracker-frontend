'use client';

import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useThemeStore } from '@/lib/store/theme-store';

export default function ThemeSwitch() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-1.5">
      <Sun className="size-3.5 text-muted-foreground" />

      <Switch
        className="hover:cursor-pointer"
        id="theme-switch"
        aria-label="Cambiar tema"
        checked={isDark}
        onCheckedChange={toggleTheme}
      />

      <Moon className="size-3.5 text-muted-foreground" />
    </div>
  );
}

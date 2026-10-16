import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} />;
}

function LoadingState({
  label = "Cargando...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground",
        className
      )}
    >
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

export { Spinner, LoadingState };

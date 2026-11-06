'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import AuthGuard from './auth-guard';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { WifiOff } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnline = useOnlineStatus();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen">
        <aside className="hidden md:block p-4 w-1/6 border-r">
          <Sidebar />
        </aside>
        <div className="flex flex-col flex-1">
          <div className="h-25 shrink-0 border-b bg-background">
            <Header />
          </div>
          {!isOnline && (
            <div className="flex shrink-0 items-center justify-center gap-1.5 bg-custom-lose/15 py-1 text-xs font-medium text-custom-lose">
              <WifiOff className="size-3.5" />
              Sin conexión — mostrando datos guardados
            </div>
          )}
          <main className="flex-1 overflow-hidden pb-6 md:pb-2">
            <div className="px-2 pb-6 md:pb-2 h-full overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

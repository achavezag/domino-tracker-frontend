'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import AuthGuard from './auth-guard';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen">
        <aside className="p-4 w-1/6 border-r">
          <Sidebar />
        </aside>
        <div className="flex flex-col flex-1">
          <div className="h-25 shrink-0 border-b bg-white">
            <Header />
          </div>
          <main className="flex-1 overflow-hidden">
            <div className="px-2 pt-2 h-full overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

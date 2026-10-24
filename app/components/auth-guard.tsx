'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

function isPathOrChild(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    const forbiddenForUser =
      isPathOrChild(pathname, "/manage") ||
      isPathOrChild(pathname, "/play") ||
      isPathOrChild(pathname, "/users");
    
    const forbiddenForSessionAdmin = isPathOrChild(pathname, "/users");

    if (role === "user" && forbiddenForUser) {
      router.replace("/");
      return;
    }

    if (role === "session_admin" && forbiddenForSessionAdmin) {
      router.replace("/");
      return;
    }
  }, [hasHydrated, token, role, pathname, router]);

  if (!hasHydrated || !token) return null;

  return <>{children}</>;
}

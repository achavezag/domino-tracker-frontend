'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState } from 'react';

const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24; // 24h

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: PERSIST_MAX_AGE,
      },
    },
  }))

  const [persister] = useState(() =>
    typeof window === 'undefined'
      ? undefined
      : createSyncStoragePersister({ storage: window.localStorage, key: 'domino-rq-cache' })
  )

  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: PERSIST_MAX_AGE, buster: 'v1' }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
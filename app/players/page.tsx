import { getPlayers } from '@/lib/api/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PlayersClient from '../components/players/players-client';

export default async function PlayersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlayersClient />
    </HydrationBoundary>
  );
}
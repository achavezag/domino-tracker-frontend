import { getPlayers, getPlayersStats } from '@/lib/api/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PlayersClient from '../components/players/players-client';

export default async function PlayersPage() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  await queryClient.prefetchQuery({
    queryKey: ["players-stats"],
    queryFn: getPlayersStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlayersClient />
    </HydrationBoundary>
  );
}
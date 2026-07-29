import { getMatches } from '@/lib/api/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import MatchesClient from '../components/match/matches-client';

export default async function MatchesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["matches", {}],
    queryFn: () => getMatches({}),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MatchesClient />
    </HydrationBoundary>
  );
}
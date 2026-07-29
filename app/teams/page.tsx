import { getTeams, getTeamsStats } from '@/lib/api/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import TeamsClient from '../components/teams/teams-client';

export default async function TeamsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  await queryClient.prefetchQuery({
    queryKey: ["teams-stats"],
    queryFn: getTeamsStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamsClient />
    </HydrationBoundary>
  );
}
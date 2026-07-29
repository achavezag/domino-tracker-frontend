import { getTeams } from '@/lib/api/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PlayClient from '../components/play/play-client';

export default async function PlayPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlayClient />
    </HydrationBoundary>
  );
}
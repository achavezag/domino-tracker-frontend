import { getPlayers } from '@/lib/api/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ManageClient from '../components/manage/manage-client';

export default async function ManagePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ManageClient />
    </HydrationBoundary>
  );
}
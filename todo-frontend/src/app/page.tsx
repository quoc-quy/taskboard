import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import DashboardClient from '@/components/dashboard/dashboard-client';
import { todoApi } from '@/lib/api-service';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const queryClient = new QueryClient();

  const page = Number(params.page) || 1;
  const search = params.search || undefined;
  const status = params.status === 'all' ? undefined : params.status;
  const priority = params.priority === 'all' ? undefined : params.priority;
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = (params.sortOrder as 'ASC' | 'DESC') || 'DESC';

  const queryParams = {
    page,
    limit: 10,
    search,
    status,
    priority,
    sortBy,
    sortOrder,
  };

  // Prefetch data on the Next.js server side before returning HTML
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['todos', queryParams],
      queryFn: () => todoApi.getAll(queryParams),
    }),
    queryClient.prefetchQuery({
      queryKey: ['stats'],
      queryFn: () => todoApi.getStats().then((res) => res.data),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient initialParams={queryParams} />
    </HydrationBoundary>
  );
}

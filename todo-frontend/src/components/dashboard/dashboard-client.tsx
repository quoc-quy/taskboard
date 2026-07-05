'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

import { Card, CardContent } from '@/components/ui/card';
import { TaskDialog } from '@/components/task-dialog';
import { DeleteDialog } from '@/components/delete-dialog';

import { Header } from '@/components/dashboard/header';
import { ProgressSection } from '@/components/dashboard/progress-section';
import { FilterBar } from '@/components/dashboard/filter-bar';
import { TaskItem } from '@/components/dashboard/task-item';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Pagination } from '@/components/dashboard/pagination';

import { todoApi } from '@/lib/api-service';
import { Todo, TodoStatus } from '@/types/todo';

interface DashboardClientProps {
  initialParams: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  };
}

export default function DashboardClient({ initialParams }: DashboardClientProps) {
  const queryClient = useQueryClient();

  // Initialize client states using initial parameters from the server URL
  const [page, setPage] = useState(initialParams.page);
  const [limit] = useState(initialParams.limit);
  const [searchInput, setSearchInput] = useState(initialParams.search || '');
  const [search, setSearch] = useState(initialParams.search || '');
  const [status, setStatus] = useState<string>(initialParams.status || 'all');
  const [priority, setPriority] = useState<string>(initialParams.priority || 'all');
  const [sortBy, setSortBy] = useState<string>(initialParams.sortBy);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(initialParams.sortOrder);

  // Dialog states
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const queryParams = {
    page,
    limit,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
    priority: priority === 'all' ? undefined : priority,
    sortBy,
    sortOrder,
  };

  // Queries (these will instantly pull from hydrated cache pre-rendered by Next.js Server Component)
  const { data: todosData, isLoading: isTodosLoading } = useQuery({
    queryKey: ['todos', queryParams],
    queryFn: () => todoApi.getAll(queryParams),
  });

  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: () => todoApi.getStats().then((res) => res.data),
  });

  // Reset pagination when filters change
  const handleFilterChange = (type: 'status' | 'priority', val: string | null) => {
    const value = val || 'all';
    if (type === 'status') setStatus(value);
    if (type === 'priority') setPriority(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('all');
    setPriority('all');
    setPage(1);
  };

  // Optimistic Update Mutation for Toggle Status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoApi.update(id, {
        status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING,
      }),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['todos', queryParams] });
      await queryClient.cancelQueries({ queryKey: ['stats'] });

      const previousTodos = queryClient.getQueryData(['todos', queryParams]);
      const previousStats = queryClient.getQueryData(['stats']);

      if (previousTodos) {
        queryClient.setQueryData(['todos', queryParams], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((todo: Todo) => {
              if (todo.id === id) {
                return {
                  ...todo,
                  status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING,
                  completedAt: completed ? new Date().toISOString() : null,
                };
              }
              return todo;
            }),
          };
        });
      }

      if (previousStats) {
        queryClient.setQueryData(['stats'], (old: any) => {
          if (!old) return old;
          const diff = completed ? 1 : -1;
          const newCompleted = Math.max(0, old.completed + diff);
          const newPending = Math.max(0, old.pending - diff);
          const newTotal = old.total;
          return {
            ...old,
            completed: newCompleted,
            pending: newPending,
            completionRate: newTotal > 0 ? Math.round((newCompleted / newTotal) * 100) : 0,
          };
        });
      }

      return { previousTodos, previousStats };
    },
    onError: (err, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos', queryParams], context.previousTodos);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(['stats'], context.previousStats);
      }
      toast.error('Failed to update task status');
    },
    onSuccess: () => {
      toast.success('Task updated successfully 🌸');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => todoApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Task deleted successfully ✨');
      setIsDeleteDialogOpen(false);
      setTaskToDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  const handleDeleteConfirm = () => {
    if (taskToDeleteId) {
      deleteMutation.mutate(taskToDeleteId);
    }
  };

  const handleEditClick = (task: Todo) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const isFiltered = !!search || status !== 'all' || priority !== 'all';

  return (
    <div className="flex-1 flex flex-col bg-background/50 max-w-5xl mx-auto w-full px-4 py-8 md:px-6">
      <Header onCreateClick={handleCreateClick} />

      <ProgressSection
        total={statsData?.total ?? 0}
        completed={statsData?.completed ?? 0}
        pending={statsData?.pending ?? 0}
        completionRate={statsData?.completionRate ?? 0}
      />

      <FilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        status={status}
        onStatusChange={(val) => handleFilterChange('status', val)}
        priority={priority}
        onPriorityChange={(val) => handleFilterChange('priority', val)}
        sortBy={sortBy}
        onSortByChange={(val) => setSortBy(val || 'createdAt')}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
      />

      <main className="flex-1 space-y-3 min-h-[300px] relative">
        {isTodosLoading ? (
          // Shimmer Skeleton Loading
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/30 bg-card rounded-3xl animate-pulse">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-5.5 w-5.5 bg-muted rounded-lg" />
                  <div className="space-y-2 flex-1 max-w-sm">
                    <div className="h-4 bg-muted rounded-md w-2/3" />
                    <div className="h-3.5 bg-muted rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-muted rounded-full" />
              </CardContent>
            </Card>
          ))
        ) : !todosData?.data || todosData.data.length === 0 ? (
          <EmptyState isFiltered={isFiltered} onClearFilters={handleClearFilters} />
        ) : (
          <div className="space-y-3.5">
            <AnimatePresence mode="popLayout">
              {todosData.data.map((todo) => (
                <TaskItem
                  key={todo.id}
                  todo={todo}
                  onToggleStatus={(id, completed) =>
                    toggleStatusMutation.mutate({ id, completed })
                  }
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {todosData?.meta && todosData.meta.totalPages > 1 && (
        <Pagination
          page={todosData.meta.page}
          totalPages={todosData.meta.totalPages}
          totalItems={todosData.meta.totalItems}
          onPageChange={setPage}
          hasPreviousPage={todosData.meta.hasPreviousPage}
          hasNextPage={todosData.meta.hasNextPage}
        />
      )}

      <TaskDialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen} task={selectedTask} />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

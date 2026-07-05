'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Todo, TodoPriority } from '@/types/todo';
import { todoApi } from '@/lib/api-service';

// Define Zod validation schema
const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(150, 'Title cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  priority: z.nativeEnum(TodoPriority),
  dueDate: z.string().optional().or(z.literal('')),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Todo | null; // If provided, we are in edit mode
}

export function TaskDialog({ open, onOpenChange, task }: TaskDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!task;

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TodoPriority.MEDIUM,
      dueDate: '',
    },
  });

  const priorityValue = watch('priority');

  // Populate fields when editing
  useEffect(() => {
    if (open) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '', // YYYY-MM-DD
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: TodoPriority.MEDIUM,
          dueDate: '',
        });
      }
    }
  }, [open, task, reset]);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: todoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Task created successfully');
      onOpenChange(false);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to create task';
      toast.error(msg);
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      todoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Task updated successfully');
      onOpenChange(false);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to update task';
      toast.error(msg);
    },
  });

  const onSubmit = (values: TaskFormValues) => {
    const formattedData = {
      ...values,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    };

    if (isEditMode && task) {
      updateMutation.mutate({ id: task.id, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEditMode ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Title Field */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Finish Next.js layout design"
              disabled={isLoading}
              className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs font-medium text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description for this task..."
              rows={3}
              disabled={isLoading}
              className={
                errors.description ? 'border-destructive focus-visible:ring-destructive' : 'resize-none'
              }
              {...register('description')}
            />
            {errors.description && (
              <p className="text-xs font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Select */}
            <div className="space-y-1.5">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={priorityValue}
                onValueChange={(val) =>
                  setValue('priority', (val as TodoPriority) || TodoPriority.MEDIUM)
                }
                disabled={isLoading}
              >
                <SelectTrigger id="priority" className="w-full">
                  <span className="capitalize">
                    {priorityValue}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TodoPriority.LOW}>Low</SelectItem>
                  <SelectItem value={TodoPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TodoPriority.HIGH}>High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date Picker */}
            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                disabled={isLoading}
                {...register('dueDate')}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-border mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[80px]">
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

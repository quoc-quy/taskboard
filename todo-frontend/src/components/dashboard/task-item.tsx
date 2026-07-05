'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, AlertCircle, Edit2, Trash2, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Todo, TodoStatus, TodoPriority } from '@/types/todo';

interface TaskItemProps {
  todo: Todo;
  onToggleStatus: (id: string, completed: boolean) => void;
  onEditClick: (todo: Todo) => void;
  onDeleteClick: (id: string) => void;
}

const getPriorityBadge = (priority: TodoPriority) => {
  switch (priority) {
    case TodoPriority.HIGH:
      return (
        <Badge variant="outline" className="border-red-400/20 bg-red-400/10 text-red-500 text-[11px] font-medium rounded-full px-2 py-0.5 shadow-sm">
          High ⚠️
        </Badge>
      );
    case TodoPriority.MEDIUM:
      return (
        <Badge variant="outline" className="border-amber-400/20 bg-amber-400/10 text-amber-600 dark:text-amber-500 text-[11px] font-medium rounded-full px-2 py-0.5 shadow-sm">
          Medium ☕
        </Badge>
      );
    case TodoPriority.LOW:
      return (
        <Badge variant="outline" className="border-sky-400/20 bg-sky-400/10 text-sky-500 text-[11px] font-medium rounded-full px-2 py-0.5 shadow-sm">
          Low 🌸
        </Badge>
      );
  }
};

const formatDueDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const isOverdue = (dateStr: string | null, status: TodoStatus) => {
  if (!dateStr || status === TodoStatus.COMPLETED) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
};

export function TaskItem({
  todo,
  onToggleStatus,
  onEditClick,
  onDeleteClick,
}: TaskItemProps) {
  const isCompleted = todo.status === TodoStatus.COMPLETED;
  const overdue = isOverdue(todo.dueDate, todo.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      whileHover={{ y: -2 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        layout: { duration: 0.25 },
      }}
    >
      <Card
        className={`transition-all border-border/20 dark:border-border/10 bg-card rounded-[1.5rem] shadow-sm hover:shadow-md ${
          isCompleted ? 'bg-secondary/15 border-border/10 opacity-70' : ''
        }`}
      >
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
          {/* Task details */}
          <div className="flex items-start gap-4 flex-1">
            {/* Checklist Toggler */}
            <button
              onClick={() => onToggleStatus(todo.id, !isCompleted)}
              className={`mt-0.5 h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-emerald-400 border-emerald-500 text-white'
                  : 'border-muted-foreground/35 hover:border-primary/50 bg-background'
              }`}
              title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
            >
              {isCompleted && <Check className="h-4 w-4" />}
            </button>

            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-2">
                <span
                  className={`font-bold tracking-tight text-base transition-all ${
                    isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  {todo.title}
                </span>
                {getPriorityBadge(todo.priority)}
                {overdue && (
                  <Badge variant="outline" className="border-red-400/20 bg-red-400/10 text-red-500 text-[11px] font-medium rounded-full px-2 py-0.5 shadow-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Overdue
                  </Badge>
                )}
              </div>
              {todo.description && (
                <p className={`text-sm max-w-2xl font-medium tracking-wide ${isCompleted ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                  {todo.description}
                </p>
              )}

              {/* Due date display */}
              {todo.dueDate && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 pt-1 font-semibold">
                  <CalendarDays className={`h-4 w-4 ${overdue ? 'text-red-500' : 'text-muted-foreground/60'}`} />
                  <span className={overdue ? 'text-red-500 font-bold' : ''}>
                    Due {formatDueDate(todo.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-border/30 pt-3 sm:pt-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditClick(todo)}
              className="h-8.5 w-8.5 text-muted-foreground/85 hover:text-foreground hover:bg-secondary/40 rounded-full"
              title="Edit Task"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteClick(todo.id)}
              className="h-8.5 w-8.5 text-muted-foreground/85 hover:text-destructive hover:bg-destructive/10 rounded-full"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

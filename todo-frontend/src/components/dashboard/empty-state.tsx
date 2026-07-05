'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ isFiltered, onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center border border-dashed border-border/40 rounded-3xl py-16 px-4 text-center bg-card/10"
    >
      <span className="text-4xl mb-4 select-none">🌸</span>
      <h3 className="text-lg font-bold tracking-tight">You&apos;re all caught up!</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-[320px] font-medium">
        {isFiltered
          ? 'Try adjusting your search criteria or resetting filters.'
          : 'Enjoy your free time today. Or add a task to plan ahead.'}
      </p>
      {isFiltered && (
        <Button
          variant="link"
          onClick={onClearFilters}
          className="mt-3 text-xs font-bold text-violet-500 hover:text-violet-600 dark:text-violet-400"
        >
          Clear all filters
        </Button>
      )}
    </motion.div>
  );
}

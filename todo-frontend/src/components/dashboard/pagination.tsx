'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (p: number) => void;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  hasPreviousPage,
  hasNextPage,
}: PaginationProps) {
  return (
    <footer className="flex items-center justify-between border-t border-border/40 pt-6 mt-8">
      <span className="text-xs font-bold text-muted-foreground">
        Page {page} of {totalPages} ({totalItems} tasks)
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!hasPreviousPage}
          className="text-xs font-bold rounded-xl h-8.5 px-3 active:scale-95"
        >
          Prev
        </Button>

        {/* Simple numbered pages */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pNum = idx + 1;
            return (
              <Button
                key={pNum}
                variant={pNum === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pNum)}
                className="w-8.5 h-8.5 p-0 text-xs font-bold rounded-xl active:scale-95"
              >
                {pNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={!hasNextPage}
          className="text-xs font-bold rounded-xl h-8.5 px-3 active:scale-95"
        >
          Next
        </Button>
      </div>
    </footer>
  );
}

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
          {(() => {
            // WINDOWED PAGINATION: Dynamically render only a window of page numbers around the current page
            // (e.g. Page 1, current page +/- 1, last page, and ellipses) to prevent horizontal layout overflow
            // when totalPages is large.
            const pages: (number | string)[] = [];
            const range = 1; // show current page +/- 1

            for (let i = 1; i <= totalPages; i++) {
              if (
                i === 1 ||
                i === totalPages ||
                (i >= page - range && i <= page + range)
              ) {
                pages.push(i);
              } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
              }
            }

            return pages.map((pNum, idx) => {
              if (pNum === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-1.5 text-xs font-semibold text-muted-foreground select-none">
                    ...
                  </span>
                );
              }
              const numVal = pNum as number;
              return (
                <Button
                  key={numVal}
                  variant={numVal === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(numVal)}
                  className="w-8.5 h-8.5 p-0 text-xs font-bold rounded-xl active:scale-95"
                >
                  {numVal}
                </Button>
              );
            });
          })()}
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

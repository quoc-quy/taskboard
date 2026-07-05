'use client'

import React from 'react'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { TodoPriority } from '@/types/todo'

interface FilterBarProps {
  searchInput: string
  onSearchInputChange: (val: string) => void
  status: string
  onStatusChange: (val: string | null) => void
  priority: string
  onPriorityChange: (val: string | null) => void
  sortBy: string
  onSortByChange: (val: string | null) => void
  sortOrder: 'ASC' | 'DESC'
  onSortOrderToggle: () => void
}

export function FilterBar({
  searchInput,
  onSearchInputChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle
}: FilterBarProps) {
  return (
    <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/60 backdrop-blur-md border border-border/30 p-4 rounded-3xl shadow-sm mb-6">
      {/* Soft Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <Input
          placeholder="Search for a task..."
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="pl-9.5 w-full bg-background border-none shadow-none rounded-2xl text-sm h-10 placeholder:text-muted-foreground/45"
        />
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-muted-foreground/75 px-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="text-xs font-bold tracking-tight hidden sm:inline">Filters:</span>
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border/30 bg-background/50 px-3">
            <span className="text-muted-foreground mr-1">Status:</span>
            <span className="font-bold text-foreground capitalize">
              {status === 'all' ? 'All' : status}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border/30 bg-background/50 px-3">
            <span className="text-muted-foreground mr-1">Priority:</span>
            <span className="font-bold text-foreground capitalize">
              {priority === 'all' ? 'All' : priority}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value={TodoPriority.HIGH}>High</SelectItem>
            <SelectItem value={TodoPriority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={TodoPriority.LOW}>Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort By Select */}
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border/30 bg-background/50 px-3">
            <span className="text-muted-foreground mr-1">Sort:</span>
            <span className="font-bold text-foreground">
              {sortBy === 'createdAt' ? 'Date Created' :
               sortBy === 'dueDate' ? 'Due Date' :
               sortBy === 'title' ? 'Title' :
               sortBy === 'priority' ? 'Priority' : sortBy}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onSortOrderToggle}
          className="h-9 w-9 rounded-xl border-border/30 bg-background/50 hover:bg-background active:scale-95"
          title={sortOrder === 'ASC' ? 'Ascending' : 'Descending'}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </section>
  )
}

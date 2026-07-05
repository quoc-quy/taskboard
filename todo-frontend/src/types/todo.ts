export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export enum TodoPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface Todo {
  id: string
  title: string
  description: string | null
  status: TodoStatus
  priority: TodoPriority
  dueDate: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  completionRate: number
  byPriority: {
    high: number
    medium: number
    low: number
  }
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

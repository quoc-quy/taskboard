import api from './api';
import { Todo, TodoStats, PaginatedResponse, ApiResponse } from '@/types/todo';

export const todoApi = {
  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedResponse<Todo>> {
    const response = await api.get<PaginatedResponse<Todo>>('/todos', { params });
    return response.data;
  },

  async getStats(): Promise<ApiResponse<TodoStats>> {
    const response = await api.get<ApiResponse<TodoStats>>('/todos/stats');
    return response.data;
  },

  async getOne(id: string): Promise<ApiResponse<Todo>> {
    const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
    return response.data;
  },

  async create(data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string | null;
  }): Promise<ApiResponse<Todo>> {
    const response = await api.post<ApiResponse<Todo>>('/todos', data);
    return response.data;
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string | null;
      priority?: string;
      dueDate?: string | null;
      status?: string;
    },
  ): Promise<ApiResponse<Todo>> {
    const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },
};

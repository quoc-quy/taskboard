/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from './todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoQueryDto } from './dto/todo-query.dto';
import { Todo } from './entities/todo.entity';
import { TodoStatus, TodoPriority } from './todo.enum';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todoData: Partial<Todo> = {
      title: createTodoDto.title,
      description: createTodoDto.description || null,
      priority: createTodoDto.priority || TodoPriority.MEDIUM,
      status: TodoStatus.PENDING,
      dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : null,
    };

    return this.todoRepository.create(todoData);
  }

  async findAll(queryDto: TodoQueryDto) {
    const [data, totalItems] = await this.todoRepository.findAndCount(queryDto);
    const limit = queryDto.limit || 10;
    const page = queryDto.page || 1;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo task with ID "${id}" not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id); // Throws NotFoundException if not exists

    // Apply basic fields
    if (updateTodoDto.title !== undefined) todo.title = updateTodoDto.title;
    if (updateTodoDto.description !== undefined)
      todo.description = updateTodoDto.description;
    if (updateTodoDto.priority !== undefined)
      todo.priority = updateTodoDto.priority;
    if (updateTodoDto.dueDate !== undefined) {
      todo.dueDate = updateTodoDto.dueDate
        ? new Date(updateTodoDto.dueDate)
        : null;
    }

    // Apply status change logic (manage completedAt timestamp)
    if (
      updateTodoDto.status !== undefined &&
      updateTodoDto.status !== todo.status
    ) {
      todo.status = updateTodoDto.status;
      if (todo.status === TodoStatus.COMPLETED) {
        todo.completedAt = new Date();
      } else {
        todo.completedAt = null;
      }
    }

    return this.todoRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.todoRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Todo task with ID "${id}" not found`);
    }
  }

  async getStatistics() {
    const rawStats = await this.todoRepository.getStats();

    let total = 0;
    let completed = 0;
    let pending = 0;
    const byPriority = {
      high: 0,
      medium: 0,
      low: 0,
    };

    rawStats.statusStats.forEach((stat) => {
      if (stat.status === TodoStatus.COMPLETED) {
        completed = stat.count;
      } else if (stat.status === TodoStatus.PENDING) {
        pending = stat.count;
      }
      total += stat.count;
    });

    rawStats.priorityStats.forEach((stat) => {
      if (stat.priority === TodoPriority.HIGH) {
        byPriority.high = stat.count;
      } else if (stat.priority === TodoPriority.MEDIUM) {
        byPriority.medium = stat.count;
      } else if (stat.priority === TodoPriority.LOW) {
        byPriority.low = stat.count;
      }
    });

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate,
      byPriority,
    };
  }
}

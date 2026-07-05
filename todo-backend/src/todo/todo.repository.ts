/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { TodoQueryDto } from './dto/todo-query.dto';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
  ) {}

  async findAndCount(queryDto: TodoQueryDto): Promise<[Todo[], number]> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder = this.repository.createQueryBuilder('todo');

    // Filtering by status
    if (status) {
      queryBuilder.andWhere('todo.status = :status', { status });
    }

    // Filtering by priority
    if (priority) {
      queryBuilder.andWhere('todo.priority = :priority', { priority });
    }

    // Fuzzy searching by title or description (case-insensitive)
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(todo.title) LIKE LOWER(:search) OR LOWER(todo.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    // Sorting (safe from SQL Injection since DTO limits sortBy value to specific properties)
    queryBuilder.orderBy(`todo.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    return queryBuilder.getManyAndCount();
  }

  async findById(id: string): Promise<Todo | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = this.repository.create(todo);
    return this.repository.save(newTodo);
  }

  async save(todo: Todo): Promise<Todo> {
    return this.repository.save(todo);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return !!result.affected && result.affected > 0;
  }

  async getStats(): Promise<{
    statusStats: { status: string; count: number }[];
    priorityStats: { priority: string; count: number }[];
  }> {
    const statusStats = await this.repository
      .createQueryBuilder('todo')
      .select('todo.status', 'status')
      .addSelect('COUNT(todo.id)', 'count')
      .groupBy('todo.status')
      .getRawMany();

    const priorityStats = await this.repository
      .createQueryBuilder('todo')
      .select('todo.priority', 'priority')
      .addSelect('COUNT(todo.id)', 'count')
      .groupBy('todo.priority')
      .getRawMany();

    return {
      statusStats: statusStats.map((s) => ({
        status: s.status,
        count: parseInt(s.count, 10),
      })),
      priorityStats: priorityStats.map((p) => ({
        priority: p.priority,
        count: parseInt(p.count, 10),
      })),
    };
  }
}

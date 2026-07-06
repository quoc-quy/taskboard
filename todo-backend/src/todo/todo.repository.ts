import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { TodoQueryDto } from './dto/todo-query.dto';

/** Raw row shapes returned by TypeORM getRawMany() */
interface StatusStatRow {
  status: string;
  count: string; // PostgreSQL COUNT returns a string
}

interface PriorityStatRow {
  priority: string;
  count: string;
}

/** Whitelist map for sortBy to prevent SQL injection at the query-builder level */
const ALLOWED_SORT_FIELDS: Record<string, string> = {
  createdAt: 'todo.createdAt',
  updatedAt: 'todo.updatedAt',
  dueDate: 'todo.dueDate',
  title: 'todo.title',
  priority: 'todo.priority',
};

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

    // Fuzzy searching by title or description using PostgreSQL native ILIKE (case-insensitive)
    if (search) {
      queryBuilder.andWhere(
        '(todo.title ILIKE :search OR todo.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting — resolved through ALLOWED_SORT_FIELDS whitelist for defense-in-depth
    if (sortBy === 'priority') {
      // DATABASE SORTING WEIGHTS: PostgreSQL sorts enum fields alphabetically or by definition index.
      // Map enum priority strings to integer weights (high -> 3, medium -> 2, low -> 1) using a SQL CASE
      // statement to ensure correct conceptual sorting.
      queryBuilder.orderBy(
        `CASE todo.priority
          WHEN 'high' THEN 3
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 1
         END`,
        sortOrder,
      );
    } else {
      const sortField = ALLOWED_SORT_FIELDS[sortBy] ?? 'todo.createdAt';
      queryBuilder.orderBy(sortField, sortOrder);
    }

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
      .getRawMany<StatusStatRow>();

    const priorityStats = await this.repository
      .createQueryBuilder('todo')
      .select('todo.priority', 'priority')
      .addSelect('COUNT(todo.id)', 'count')
      .groupBy('todo.priority')
      .getRawMany<PriorityStatRow>();

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

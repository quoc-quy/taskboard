/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { TodoStatus, TodoPriority } from './todo.enum';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  let repository: jest.Mocked<TodoRepository>;

  const mockTodo: Todo = {
    id: 'uuid-1234',
    title: 'Test Title',
    description: 'Test Description',
    status: TodoStatus.PENDING,
    priority: TodoPriority.MEDIUM,
    dueDate: new Date('2026-07-15T12:00:00Z'),
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockRepositoryFactory = () => ({
    create: jest.fn(),
    findAndCount: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    getStats: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoRepository,
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get(TodoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new todo', async () => {
      const createDto: CreateTodoDto = {
        title: 'New Todo',
        description: 'New Description',
        priority: TodoPriority.HIGH,
        dueDate: '2026-07-15T12:00:00Z',
      };
      repository.create.mockResolvedValue(mockTodo);

      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalledWith({
        title: createDto.title,
        description: createDto.description,
        priority: createDto.priority,
        status: TodoStatus.PENDING,
        dueDate: expect.any(Date),
      });
      expect(result).toEqual(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of todos and metadata', async () => {
      const queryDto = { page: 1, limit: 10 };
      repository.findAndCount.mockResolvedValue([[mockTodo], 1]);

      const result = await service.findAll(queryDto);
      expect(repository.findAndCount).toHaveBeenCalledWith(queryDto);
      expect(result.data).toEqual([mockTodo]);
      expect(result.meta).toEqual({
        page: 1,
        limit: 10,
        totalItems: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe('findOne', () => {
    it('should return a todo if found', async () => {
      repository.findById.mockResolvedValue(mockTodo);

      const result = await service.findOne('uuid-1234');
      expect(repository.findById).toHaveBeenCalledWith('uuid-1234');
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('uuid-invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update todo fields successfully', async () => {
      const updateDto: UpdateTodoDto = { title: 'Updated Title' };
      repository.findById.mockResolvedValue({ ...mockTodo });
      repository.save.mockImplementation(async (todo) => todo);

      const result = await service.update('uuid-1234', updateDto);
      expect(result.title).toBe('Updated Title');
      expect(repository.save).toHaveBeenCalled();
    });

    it('should set completedAt when status is updated to COMPLETED', async () => {
      const updateDto: UpdateTodoDto = { status: TodoStatus.COMPLETED };
      const currentTodo = {
        ...mockTodo,
        status: TodoStatus.PENDING,
        completedAt: null,
      };
      repository.findById.mockResolvedValue(currentTodo);
      repository.save.mockImplementation(async (todo) => todo);

      const result = await service.update('uuid-1234', updateDto);
      expect(result.status).toBe(TodoStatus.COMPLETED);
      expect(result.completedAt).toBeInstanceOf(Date);
    });

    it('should clear completedAt when status is reverted to PENDING', async () => {
      const updateDto: UpdateTodoDto = { status: TodoStatus.PENDING };
      const currentTodo = {
        ...mockTodo,
        status: TodoStatus.COMPLETED,
        completedAt: new Date(),
      };
      repository.findById.mockResolvedValue(currentTodo);
      repository.save.mockImplementation(async (todo) => todo);

      const result = await service.update('uuid-1234', updateDto);
      expect(result.status).toBe(TodoStatus.PENDING);
      expect(result.completedAt).toBeNull();
    });
  });

  describe('remove', () => {
    it('should successfully remove a todo', async () => {
      repository.softDelete.mockResolvedValue(true);

      await expect(service.remove('uuid-1234')).resolves.not.toThrow();
      expect(repository.softDelete).toHaveBeenCalledWith('uuid-1234');
    });

    it('should throw NotFoundException if todo to remove does not exist', async () => {
      repository.softDelete.mockResolvedValue(false);

      await expect(service.remove('uuid-invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStatistics', () => {
    it('should return calculated statistics', async () => {
      repository.getStats.mockResolvedValue({
        statusStats: [
          { status: TodoStatus.PENDING, count: 3 },
          { status: TodoStatus.COMPLETED, count: 2 },
        ],
        priorityStats: [
          { priority: TodoPriority.HIGH, count: 1 },
          { priority: TodoPriority.MEDIUM, count: 3 },
          { priority: TodoPriority.LOW, count: 1 },
        ],
      });

      const result = await service.getStatistics();
      expect(result.total).toBe(5);
      expect(result.completed).toBe(2);
      expect(result.pending).toBe(3);
      expect(result.completionRate).toBe(40);
      expect(result.byPriority).toEqual({
        high: 1,
        medium: 3,
        low: 1,
      });
    });
  });
});

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { validate } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';
import { TodoPriority } from '../todo.enum';

describe('CreateTodoDto Validation', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreateTodoDto();
    dto.title = 'Learn testing in NestJS';
    dto.description = 'Write some unit tests for service and DTOs';
    dto.priority = TodoPriority.HIGH;
    dto.dueDate = '2026-07-15T12:00:00.000Z';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if title is empty', async () => {
    const dto = new CreateTodoDto();
    dto.title = ''; // Empty string

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const titleError = errors.find((e) => e.property === 'title');
    expect(titleError).toBeDefined();
    expect(titleError?.constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail validation if title exceeds 150 characters', async () => {
    const dto = new CreateTodoDto();
    dto.title = 'a'.repeat(151); // 151 chars

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const titleError = errors.find((e) => e.property === 'title');
    expect(titleError).toBeDefined();
    expect(titleError?.constraints?.maxLength).toBeDefined();
  });

  it('should fail validation if priority is not a valid enum value', async () => {
    const dto = new CreateTodoDto();
    dto.title = 'Valid title';
    dto.priority = 'invalid-priority-value' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const priorityError = errors.find((e) => e.property === 'priority');
    expect(priorityError).toBeDefined();
    expect(priorityError?.constraints?.isEnum).toBeDefined();
  });
});

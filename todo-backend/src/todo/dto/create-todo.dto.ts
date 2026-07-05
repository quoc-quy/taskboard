import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { TodoPriority } from '../todo.enum';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the todo task',
    maxLength: 150,
    example: 'Learn NestJS Clean Architecture',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the task',
    example:
      'Read articles and write a sample repository pattern implementation.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Task priority level',
    enum: TodoPriority,
    default: TodoPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TodoPriority)
  priority?: TodoPriority;

  @ApiPropertyOptional({
    description: 'The deadline of the task',
    example: '2026-07-10T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

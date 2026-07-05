import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';
import { TodoStatus } from '../todo.enum';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiPropertyOptional({
    description: 'The status of the task',
    enum: TodoStatus,
  })
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

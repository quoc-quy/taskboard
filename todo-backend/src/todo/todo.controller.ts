import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoQueryDto } from './dto/todo-query.dto';
import { Todo } from './entities/todo.entity';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The task has been successfully created.',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.create(createTodoDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get overall statistics of todo tasks' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Aggregated statistics of tasks (totals, priorities, completion rate).',
  })
  getStatistics() {
    return this.todoService.getStatistics();
  }

  @Get()
  @ApiOperation({
    summary:
      'Get paginated list of todo tasks with filtering, sorting, and search',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of tasks along with metadata.',
  })
  findAll(@Query() queryDto: TodoQueryDto) {
    return this.todoService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single todo task by ID' })
  @ApiParam({ name: 'id', description: 'Todo UUID string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todo task details.',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo task not found.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing todo task' })
  @ApiParam({ name: 'id', description: 'Todo UUID string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todo task has been successfully updated.',
    type: Todo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo task not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a todo task' })
  @ApiParam({ name: 'id', description: 'Todo UUID string' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The todo task has been successfully soft deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo task not found.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.todoService.remove(id);
  }
}

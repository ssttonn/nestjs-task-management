import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskBody } from '../dtos/create-task-body.dto';
import { UpdateTaskBody } from '../dtos/update-task-body.dto';
import { TasksService } from '../services/tasks.service';
import { TaskFilterQuery } from '../dtos/task-filter-query.dto';

@Controller('tasks')
export class TasksController {
  constructor(protected tasksService: TasksService) {}

  @Get()
  getAllTasks(@Query() filterQuery: TaskFilterQuery) {
    return this.tasksService.getAllTasks(filterQuery);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Post('create')
  createNewTask(@Body() payload: CreateTaskBody) {
    return this.tasksService.createTask(payload);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() payload: UpdateTaskBody) {
    return this.tasksService.updateTask(id, payload);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}

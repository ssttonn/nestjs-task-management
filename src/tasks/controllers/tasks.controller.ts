import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { Task } from '../models/task.model';
import { CreateTaskBody } from '../dtos/create-task-body.dto';

@Controller('tasks')
export class TasksController {
    constructor(protected tasksService: TasksService) { }

    @Get()
    getAllTasks() {
        return this.tasksService.getAllTasks()
    }

    @Post("create")
    createNewTask(@Body() payload: CreateTaskBody) {
        return this.tasksService.createTask(payload)
    }
}

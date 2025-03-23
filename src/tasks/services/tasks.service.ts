import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task, TaskStatus } from '../models/task.model';
import { v4 } from 'uuid';
import { CreateTaskBody } from '../dtos/create-task-body.dto';
import { TaskFilterQuery } from '../dtos/task-filter-query.dto';
import { UpdateTaskBody } from '../dtos/update-task-body.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(filterQuery: TaskFilterQuery): Promise<Task[]> {
    const statuses = filterQuery.statuses;
    const search = filterQuery.search;

    let filteredTasks = [...this.tasks];
    console.log('filteredTasks', filteredTasks);

    if (statuses && statuses.length > 0) {
      filteredTasks = [
        ...filteredTasks.filter((task) => statuses.includes(task.status)),
      ];
    }

    if (search) {
      filteredTasks = [
        ...filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase()),
        ),
      ];
    }

    return Promise.resolve(filteredTasks);
  }

  getTaskById(id: string): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return Promise.resolve(task);
  }

  createTask(payload: CreateTaskBody): Promise<Task> {
    const newTask: Task = {
      ...payload,
      id: v4(),
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);

    return Promise.resolve(newTask);
  }

  updateTask(id: string, payload: UpdateTaskBody): Promise<Task> {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    this.tasks[taskIndex] = {
      ...payload,
      ...this.tasks[taskIndex],
    };

    return Promise.resolve(this.tasks[taskIndex]);
  }

  deleteTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return Promise.resolve();
  }
}

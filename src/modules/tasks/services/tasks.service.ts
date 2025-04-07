import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreateTaskBody } from '../dtos/create-task-body.dto';
import { TaskFilterQuery } from '../dtos/task-filter-query.dto';
import { UpdateTaskBody } from '../dtos/update-task-body.dto';
import { PrismaService } from 'src/modules/shared/services/prisma/prisma.service';
import { TaskStatus, Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  private tasks: Task[] = [];

  async getAllTasks(filterQuery: TaskFilterQuery): Promise<Task[]> {
    const statuses = filterQuery.statuses;
    const search = filterQuery.search;

    const tasks = await this.prismaService.task.findMany({
      where: {
        OR: search
          ? [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ]
          : undefined,
        AND: statuses
          ? {
              status: {
                in: statuses,
              },
            }
          : undefined,
      },
    });

    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.prismaService.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  async createTask(payload: CreateTaskBody): Promise<Task> {
    let newTask = await this.prismaService.task.create({
      data: {
        ...payload,
      },
    });

    return newTask;
  }

  async updateTask(id: number, payload: UpdateTaskBody): Promise<Task> {
    let count = await this.prismaService.task.count({
      where: {
        id,
      },
    });

    if (count <= 0) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    const updatedTask = await this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
    });

    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    let count = await this.prismaService.task.count({
      where: {
        id,
      },
    });

    if (count <= 0) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }
}

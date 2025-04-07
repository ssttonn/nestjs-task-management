import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskBody } from '../dtos/create-task-body.dto';
import { TaskFilterQuery } from '../dtos/task-filter-query.dto';
import { UpdateTaskBody } from '../dtos/update-task-body.dto';
import { PrismaService } from 'src/modules/shared/services/prisma/prisma.service';
import { Task } from '@prisma/client';
import { ScopeService } from 'src/modules/shared/services/scope/scope.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly scopeService: ScopeService,
  ) {}

  private get defaultTaskInclude() {
    return {
      owner: {
        omit: {
          password: true,
        },
      },
    };
  }

  async getAllTasks(filterQuery: TaskFilterQuery): Promise<Task[]> {
    const currentUser = this.scopeService.currentUser;

    if (!currentUser) {
      throw new UnauthorizedException();
    }

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
        ownerId: currentUser.id,
      },
      include: this.defaultTaskInclude,
    });

    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const currentUser = this.scopeService.currentUser;

    if (!currentUser) {
      throw new UnauthorizedException();
    }

    const task = await this.prismaService.task.findUnique({
      where: {
        id,
      },
      include: this.defaultTaskInclude,
    });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return task;
  }

  async createTask(payload: CreateTaskBody): Promise<Task> {
    let currentUser = this.scopeService.currentUser;
    if (!currentUser) {
      throw new UnauthorizedException();
    }

    let newTask = await this.prismaService.task.create({
      data: {
        ...payload,
        owner: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: this.defaultTaskInclude,
    });

    return newTask;
  }

  async updateTask(id: number, payload: UpdateTaskBody): Promise<Task> {
    await this.checkTaskPermissions(id);

    const updatedTask = await this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        ...payload,
      },
      include: this.defaultTaskInclude,
    });

    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    await this.checkTaskPermissions(id);
    await this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }

  private async checkTaskPermissions(id: number): Promise<void> {
    let currentUser = this.scopeService.currentUser;
    if (!currentUser) {
      throw new UnauthorizedException();
    }

    let existingTask = await this.getTaskById(id);

    if (existingTask.ownerId !== currentUser.id) {
      throw new HttpException(
        'You are not authorized to delete this task',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

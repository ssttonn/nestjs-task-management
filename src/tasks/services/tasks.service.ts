import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from '../models/task.model';
import { v4 } from 'uuid';
import { CreateTaskBody } from '../dtos/create-task-body.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Promise<Task[]> {
        return Promise.resolve(this.tasks)
    }

    createTask(payload: CreateTaskBody): Promise<Task> {
        let newTask: Task = {
            ...payload,
            id: v4(),
            status: TaskStatus.OPEN
        }
        this.tasks.push(newTask)

        return Promise.resolve(newTask)
    }
}

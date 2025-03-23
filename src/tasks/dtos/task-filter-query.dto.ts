import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../models/task.model';
import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskFilterQuery {
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    const stringStatuses = value.split(',');
    const invalidStatuses = stringStatuses.filter(
      (status) =>
        !Object.values(TaskStatus).includes(status.toUpperCase() as TaskStatus),
    );

    if (invalidStatuses.length > 0) {
      throw new HttpException(
        `Invalid statuses: ${invalidStatuses.join(',')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const statuses = stringStatuses.map((status) => {
      return status as TaskStatus;
    });

    return statuses;
  })
  @IsArray()
  @IsNotEmpty()
  statuses: Array<TaskStatus>;

  @IsString()
  @IsOptional()
  search: string;
}

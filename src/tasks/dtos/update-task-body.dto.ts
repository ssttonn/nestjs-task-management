import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../models/task.model';

export class UpdateTaskBody {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

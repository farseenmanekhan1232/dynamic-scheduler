import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

enum TaskState {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  DELETED = 'DELETED',
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly taskId: string;

  @IsNotEmpty()
  @IsString()
  readonly taskName: string;

  @IsNotEmpty()
  @IsDateString()
  readonly scheduleTime: Date;

  // @IsNotEmpty()
  // @IsString()
  // readonly taskDescription: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly category: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly subscriptionCode: string;

  // @IsOptional()
  // @IsString()
  // readonly payloadProvider?: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly taskHandler: string;

  // @IsOptional()
  // @IsString()
  // readonly predecessor?: string;

  // @IsOptional()
  // @IsString()
  // readonly executionPolicy?: string;

  // @IsEnum(TaskState)
  // readonly state: TaskState;

  // @IsNotEmpty()
  // @IsString()
  // readonly scopeId: string;

  // @IsInt()
  // readonly versionNumber: number;

  // @IsNotEmpty()
  // @IsString()
  // readonly createdBy: string;

  // @IsDateString()
  // readonly createdOn: string;

  // @IsNotEmpty()
  // @IsString()
  // readonly updatedBy: string;

  // @IsDateString()
  // readonly updatedOn: string;
}

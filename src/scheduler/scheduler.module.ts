import { Module } from '@nestjs/common';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';

@Module({
  providers: [TaskService],
  controllers: [TaskController]
})
export class SchedulerModule {}
